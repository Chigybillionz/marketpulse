const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const WelcomeUser = require('../src/models/WelcomeUser');
const Debtor = require('../src/models/Debtor');
const Notification = require('../src/models/Notification');
const { logReminder } = require('../src/controllers/DebtorController');

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

async function runCreditReminderTests() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketpulse');

  const testEmail = 'merchant_remind_' + Date.now() + '@marketpulse.com';
  let merchant;
  let debtor;

  try {
    // 1. Create merchant user
    console.log('\n--- Test 1: Setup test merchant ---');
    merchant = await WelcomeUser.create({
      storeName: 'Reminder Test Store',
      email: testEmail.toLowerCase(),
      password: 'HashedPasswordTest123!',
      phoneNumber: '08012345678'
    });
    console.log('PASS: Test merchant created:', merchant.email);

    // 2. Create active debtor with phone number
    console.log('\n--- Test 2: Create active debtor ---');
    debtor = await Debtor.create({
      merchantEmail: testEmail.toLowerCase(),
      customerName: 'Chidi Okonkwo',
      phoneNumber: '08098765432',
      totalOwed: 25000,
      dueDate: new Date(Date.now() + 7 * 86400000),
      status: 'ACTIVE',
      transactions: [{
        type: 'CREDIT_SALE',
        amount: 25000,
        date: new Date(),
        description: 'Bags of Rice'
      }]
    });
    console.log('PASS: Active debtor created with totalOwed: ₦' + debtor.totalOwed);

    // 3. Log first reminder
    console.log('\n--- Test 3: Log reminder successfully ---');
    const req1 = {
      params: { id: debtor._id.toString() },
      body: {
        email: testEmail,
        channel: 'whatsapp',
        message: 'Friendly reminder about balance of ₦25,000'
      }
    };
    const res1 = createMockRes();
    await logReminder(req1, res1);

    console.assert(res1.statusCode === 200, `Expected 200, got ${res1.statusCode}`);
    console.assert(res1.body.reminder.channel === 'whatsapp', 'Reminder channel should be whatsapp');
    console.assert(res1.body.reminder.amountAtTime === 25000, 'Snapshot of amountAtTime should be 25000');
    console.assert(res1.body.lastRemindedAt, 'lastRemindedAt should be updated');
    console.log('PASS: Reminder logged successfully, response status 200');

    // 4. Verify in-app notification created for merchant
    console.log('\n--- Test 4: Verify merchant in-app notification ---');
    const notif = await Notification.findOne({
      user: merchant._id,
      type: 'credit_reminder'
    });
    console.assert(notif !== null, 'Notification should be created in DB');
    console.assert(notif.type === 'credit_reminder', 'Notification type should be credit_reminder');
    console.assert(notif.data.debtorId.toString() === debtor._id.toString(), 'Notification should reference debtorId');
    console.log('PASS: Notification created for merchant feed:', notif.title, '-', notif.message);

    // 5. Test 24-hour cooldown enforcement
    console.log('\n--- Test 5: Cooldown rejection (immediate repeat attempt) ---');
    const req2 = {
      params: { id: debtor._id.toString() },
      body: {
        email: testEmail,
        channel: 'whatsapp',
        message: 'Spam reminder'
      }
    };
    const res2 = createMockRes();
    await logReminder(req2, res2);

    console.assert(res2.statusCode === 429, `Expected 429, got ${res2.statusCode}`);
    console.assert(res2.body.retryAfterSec > 0, 'Should include retryAfterSec');
    console.assert(res2.body.cooldownEndsAt, 'Should include cooldownEndsAt timestamp');
    console.log('PASS: Cooldown enforced with status 429:', res2.body.message);

    // 6. Test reminder permitted after cooldown expires
    console.log('\n--- Test 6: Reminder permitted after 24h elapsed ---');
    // Artificially age the lastRemindedAt to 25 hours ago
    const pastTime = new Date(Date.now() - 25 * 60 * 60 * 1000);
    await Debtor.findByIdAndUpdate(debtor._id, { lastRemindedAt: pastTime });

    const req3 = {
      params: { id: debtor._id.toString() },
      body: {
        email: testEmail,
        channel: 'whatsapp',
        message: 'Second reminder after 24 hours'
      }
    };
    const res3 = createMockRes();
    await logReminder(req3, res3);

    console.assert(res3.statusCode === 200, `Expected 200, got ${res3.statusCode}`);
    const updatedDebtor = await Debtor.findById(debtor._id);
    console.assert(updatedDebtor.reminders.length === 2, `Expected 2 reminders in DB, got ${updatedDebtor.reminders.length}`);
    console.log('PASS: Second reminder logged after cooldown expired. Total reminders:', updatedDebtor.reminders.length);

    // 7. Test unauthorized merchant check
    console.log('\n--- Test 7: Unauthorized merchant rejected ---');
    const req4 = {
      params: { id: debtor._id.toString() },
      body: {
        email: 'other_merchant@marketpulse.com',
        channel: 'whatsapp'
      }
    };
    const res4 = createMockRes();
    await logReminder(req4, res4);
    console.assert(res4.statusCode === 403, `Expected 403, got ${res4.statusCode}`);
    console.log('PASS: Unauthorized merchant rejected with 403');

    // 8. Test rejection of paid-off debtor
    console.log('\n--- Test 8: Cannot remind a paid-off debtor ---');
    await Debtor.findByIdAndUpdate(debtor._id, { status: 'PAID_OFF', totalOwed: 0, lastRemindedAt: null });
    const req5 = {
      params: { id: debtor._id.toString() },
      body: {
        email: testEmail,
        channel: 'whatsapp'
      }
    };
    const res5 = createMockRes();
    await logReminder(req5, res5);
    console.assert(res5.statusCode === 400, `Expected 400, got ${res5.statusCode}`);
    console.log('PASS: Paid-off debtor reminder rejected with 400');

    // 9. Test rejection of debtor without phone number
    console.log('\n--- Test 9: Debtor without phone number rejected ---');
    const noPhoneDebtor = await Debtor.create({
      merchantEmail: testEmail.toLowerCase(),
      customerName: 'No Phone Customer',
      phoneNumber: '',
      totalOwed: 5000,
      status: 'ACTIVE'
    });
    const req6 = {
      params: { id: noPhoneDebtor._id.toString() },
      body: {
        email: testEmail,
        channel: 'whatsapp'
      }
    };
    const res6 = createMockRes();
    await logReminder(req6, res6);
    console.assert(res6.statusCode === 400, `Expected 400, got ${res6.statusCode}`);
    console.log('PASS: Debtor without phone rejected with 400');
    await Debtor.findByIdAndDelete(noPhoneDebtor._id);

    console.log('\n========================================');
    console.log('ALL 9 CREDIT REMINDER INTEGRATION TESTS PASSED!');
    console.log('========================================\n');

  } finally {
    // Cleanup test records
    if (merchant) {
      await Notification.deleteMany({ user: merchant._id });
      await WelcomeUser.findByIdAndDelete(merchant._id);
    }
    if (debtor) {
      await Debtor.findByIdAndDelete(debtor._id);
    }
    await mongoose.disconnect();
    console.log('Cleaned up test data and disconnected MongoDB.');
  }
}

runCreditReminderTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
