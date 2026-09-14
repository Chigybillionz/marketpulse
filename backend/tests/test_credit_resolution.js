const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const WelcomeUser = require('../src/models/WelcomeUser');
const Debtor = require('../src/models/Debtor');
const Transaction = require('../src/models/Transaction');
const Notification = require('../src/models/Notification');
const { resolveCredit, getDebtors, addCreditTransaction } = require('../src/controllers/DebtorController');
const { getProfileMetrics } = require('../src/services/WelcomeAuthService');

function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

async function runCreditResolutionTests() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketpulse');

  const testEmail = 'merchant_res_' + Date.now() + '@marketpulse.com';
  let merchant;
  let debtor;

  try {
    // 1. Setup test merchant
    console.log('\n--- Test 1: Create merchant account ---');
    merchant = await WelcomeUser.create({
      storeName: 'Resolution Test Store',
      email: testEmail.toLowerCase(),
      password: 'HashedPasswordTest123!',
      phoneNumber: '08033334444'
    });
    console.log('PASS: Merchant created:', merchant.email);

    // 2. Create active debtor with ₦50,000 debt
    console.log('\n--- Test 2: Create active debtor with ₦50,000 credit ---');
    debtor = await Debtor.create({
      merchantEmail: testEmail.toLowerCase(),
      customerName: 'Chidinma',
      phoneNumber: '08011223344',
      originalAmount: 50000,
      totalOwed: 50000,
      status: 'ACTIVE',
      dueDate: new Date(Date.now() + 5 * 86400000),
      transactions: [{
        type: 'CREDIT_SALE',
        amount: 50000,
        date: new Date(),
        description: 'Store Provisions'
      }]
    });
    console.assert(debtor.status === 'ACTIVE', 'Debtor should be ACTIVE');
    console.assert(debtor.totalOwed === 50000, 'Debtor totalOwed should be 50000');
    console.log('PASS: Debtor created with ₦50,000 outstanding balance');

    // 3. Partial payment test: pay ₦20,000
    console.log('\n--- Test 3: Partial payment (₦20,000 of ₦50,000) ---');
    const req1 = {
      params: { id: debtor._id.toString() },
      body: {
        email: testEmail,
        amount: 20000,
        description: 'Chidinma Part Payment'
      }
    };
    const res1 = createMockRes();
    await resolveCredit(req1, res1);

    console.assert(res1.statusCode === 200, `Expected 200, got ${res1.statusCode}`);
    console.assert(res1.body.debtor.totalOwed === 30000, `Expected remaining 30000, got ${res1.body.debtor.totalOwed}`);
    console.assert(res1.body.debtor.resolvedAmount === 20000, `Expected resolvedAmount 20000, got ${res1.body.debtor.resolvedAmount}`);
    console.assert(res1.body.debtor.status === 'PARTIALLY_PAID', `Expected status PARTIALLY_PAID, got ${res1.body.debtor.status}`);
    console.log('PASS: Status changed to PARTIALLY_PAID, remaining: ₦30,000');

    // 4. Verify financial transaction created for partial payment
    console.log('\n--- Test 4: Financial Income transaction created for partial payment ---');
    const tx1 = await Transaction.findOne({
      user: merchant._id,
      relatedCreditId: debtor._id,
      amount: 20000
    });
    console.assert(tx1 !== null, 'Income transaction should exist in MongoDB');
    console.assert(tx1.type === 'Income', 'Transaction type should be Income');
    console.assert(tx1.category === 'Credit Repayment', 'Transaction category should be Credit Repayment');
    console.assert(tx1.isCreditRecovery === true, 'Transaction isCreditRecovery should be true');
    console.assert(tx1.source.includes('Chidinma'), 'Transaction source should mention customer');
    console.log('PASS: Income transaction created:', tx1.description, '₦' + tx1.amount);

    // 5. Full remaining settlement: pay ₦30,000
    console.log('\n--- Test 5: Full remaining payment (₦30,000) ---');
    const req2 = {
      params: { id: debtor._id.toString() },
      body: {
        email: testEmail,
        amount: 30000,
        description: 'Final Settlement'
      }
    };
    const res2 = createMockRes();
    await resolveCredit(req2, res2);

    console.assert(res2.statusCode === 200, `Expected 200, got ${res2.statusCode}`);
    console.assert(res2.body.debtor.totalOwed === 0, `Expected remaining 0, got ${res2.body.debtor.totalOwed}`);
    console.assert(res2.body.debtor.resolvedAmount === 50000, `Expected resolvedAmount 50000, got ${res2.body.debtor.resolvedAmount}`);
    console.assert(res2.body.debtor.status === 'RESOLVED', `Expected status RESOLVED, got ${res2.body.debtor.status}`);
    console.assert(res2.body.debtor.resolvedAt !== null, 'resolvedAt date should be set');
    console.log('PASS: Status changed to RESOLVED, debt cleared, resolvedAt recorded');

    // 6. Verify second transaction and total financial income
    console.log('\n--- Test 6: Verify second transaction and total credit transactions ---');
    const txList = await Transaction.find({
      user: merchant._id,
      relatedCreditId: debtor._id
    });
    console.assert(txList.length === 2, `Expected 2 transactions, got ${txList.length}`);
    const totalIncome = txList.reduce((sum, t) => sum + t.amount, 0);
    console.assert(totalIncome === 50000, `Expected 50000 total income, got ${totalIncome}`);
    console.log('PASS: Two Income transactions created totaling ₦' + totalIncome);

    // 7. Verify dashboard weekly metrics integration
    console.log('\n--- Test 7: Verify weekly performance includes resolved credit payments ---');
    const metrics = await getProfileMetrics(merchant._id);
    console.assert(metrics.currentWeekIncome >= 50000, `Expected current week income >= 50000, got ${metrics.currentWeekIncome}`);
    console.log('PASS: Dashboard metrics successfully incorporates resolved credit (currentWeekIncome: ₦' + metrics.currentWeekIncome + ')');

    // 8. Security test: unauthorized merchant rejection
    console.log('\n--- Test 8: Security - unauthorized merchant rejected ---');
    const unauthorizedReq = {
      params: { id: debtor._id.toString() },
      body: {
        email: 'attacker@evil.com',
        amount: 1000
      }
    };
    const unauthorizedRes = createMockRes();
    await resolveCredit(unauthorizedReq, unauthorizedRes);
    console.assert(unauthorizedRes.statusCode === 403, `Expected 403, got ${unauthorizedRes.statusCode}`);
    console.log('PASS: Unauthorized merchant rejected with 403');

    // 9. Rejection of already resolved debtor
    console.log('\n--- Test 9: Reject resolution of already resolved credit ---');
    const repeatReq = {
      params: { id: debtor._id.toString() },
      body: {
        email: testEmail,
        amount: 5000
      }
    };
    const repeatRes = createMockRes();
    await resolveCredit(repeatReq, repeatRes);
    console.assert(repeatRes.statusCode === 400, `Expected 400, got ${repeatRes.statusCode}`);
    console.log('PASS: Double-resolution attempt rejected with 400');

    // 10. Query getDebtors returns resolved records
    console.log('\n--- Test 10: getDebtors returns resolved records ---');
    const getReq = { query: { email: testEmail } };
    const getRes = createMockRes();
    await getDebtors(getReq, getRes);
    console.assert(getRes.statusCode === 200, `Expected 200, got ${getRes.statusCode}`);
    console.assert(getRes.body.length >= 1, 'Should return at least 1 debtor');
    const foundDebtor = getRes.body.find(d => d._id.toString() === debtor._id.toString());
    console.assert(foundDebtor.status === 'RESOLVED', `Expected status RESOLVED, got ${foundDebtor.status}`);
    console.log('PASS: getDebtors returns debtor with status RESOLVED');

    // 11. addCreditTransaction creates Expense transaction
    console.log('\n--- Test 11: addCreditTransaction creates Expense outflow transaction ---');
    const addCreditReq = {
      body: {
        email: testEmail,
        customerName: 'Emeka',
        phoneNumber: '08099887766',
        amount: 15000,
        description: 'Lent cash ₦15,000'
      }
    };
    const addCreditRes = createMockRes();
    await addCreditTransaction(addCreditReq, addCreditRes);
    console.assert(addCreditRes.statusCode === 201, `Expected 201, got ${addCreditRes.statusCode}`);
    const expenseTx = await Transaction.findOne({
      user: merchant._id,
      amount: 15000,
      type: 'Expense',
      category: 'Credit Given'
    });
    console.assert(expenseTx !== null, 'Expense outflow transaction should be created for credit given');
    console.assert(expenseTx.type === 'Expense', 'Outflow transaction type should be Expense');
    console.assert(expenseTx.category === 'Credit Given', 'Outflow category should be Credit Given');
    console.log('PASS: Credit outflow transaction created (Expense: ₦15,000)');

    console.log('\n=============================================');
    console.log('ALL 11 CREDIT RESOLUTION & NETTING TESTS PASSED!');
    console.log('=============================================\n');

  } finally {
    // Cleanup
    if (merchant) {
      await Transaction.deleteMany({ user: merchant._id });
      await Notification.deleteMany({ user: merchant._id });
      await WelcomeUser.findByIdAndDelete(merchant._id);
    }
    if (debtor) {
      await Debtor.findByIdAndDelete(debtor._id);
    }
    await mongoose.disconnect();
    console.log('Test data cleaned up and disconnected from MongoDB.');
  }
}

runCreditResolutionTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
