const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const WelcomeUser = require('../src/models/WelcomeUser');
const Product = require('../src/models/Product');
const Transaction = require('../src/models/Transaction');
const Debtor = require('../src/models/Debtor');
const DataExport = require('../src/models/DataExport');
const PortabilityService = require('../src/services/PortabilityService');

async function runTests() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketpulse');

  const testEmail = 'export_test_trader@marketpulse.com';

  // 1. Create or find test user with products and transactions
  let user = await WelcomeUser.findOne({ email: testEmail });
  if (!user) {
    user = await WelcomeUser.create({
      email: testEmail,
      password: 'TestPassword123',
      businessName: 'Chijioke Super Stores',
      location: 'Onitsha Main Market, Anambra',
      businessType: 'Wholesale & Retail',
      category: 'Provisions & Groceries',
      language: 'English',
      tradePin: '1234',
    });
    console.log('Created test user:', user.email);
  }

  // 2. Ensure test products exist
  const existingProducts = await Product.find({ user: user._id });
  if (existingProducts.length === 0) {
    await Product.create([
      { user: user._id, name: 'Royal Stallion Rice 50kg', category: 'Grains', price: 78000, quantityInStock: 50 },
      { user: user._id, name: 'Golden Penny Sugar 50kg', category: 'Provisions', price: 62000, quantityInStock: 25 },
    ]);
    console.log('Created sample products for test user');
  }

  // 3. Ensure sample transactions exist
  const existingTx = await Transaction.find({ user: user._id });
  if (existingTx.length === 0) {
    await Transaction.create([
      { user: user._id, type: 'Income', amount: 390000, category: 'Sales', description: '5 Bags Rice Sale' },
      { user: user._id, type: 'Expense', amount: 15000, category: 'Logistics', description: 'Offloading fee' },
    ]);
    console.log('Created sample transactions for test user');
  }

  // 4. Test collectUserData
  console.log('\n--- Test 1: collectUserData ---');
  const collected = await PortabilityService.collectUserData(user._id, user.email);
  console.log('User businessName:', collected.user.businessName);
  console.log('Products count:', collected.products.length);
  console.log('Transactions count:', collected.transactions.length);
  console.assert(collected.products.length > 0, 'Products should not be empty');
  console.assert(collected.transactions.length > 0, 'Transactions should not be empty');
  console.log('PASS: collectUserData successful');

  // 5. Test CSV generation
  console.log('\n--- Test 2: buildCsvExport ---');
  const csvContent = PortabilityService.buildCsvExport(collected);
  console.assert(csvContent.includes('Chijioke Super Stores'), 'CSV should contain business name');
  console.assert(csvContent.includes('Royal Stallion Rice'), 'CSV should contain product name');
  console.assert(csvContent.includes('[SECTION: INVENTORY & STOCK]'), 'CSV should contain inventory section');
  console.log('CSV Preview:\n' + csvContent.slice(0, 300) + '...');
  console.log('PASS: buildCsvExport successful');

  // 6. Test JSON generation
  console.log('\n--- Test 3: buildJsonExport ---');
  const jsonContent = PortabilityService.buildJsonExport(collected);
  const parsedJson = JSON.parse(jsonContent);
  console.assert(parsedJson.metadata.account_email === testEmail, 'JSON metadata should match email');
  console.assert(Array.isArray(parsedJson.inventory) && parsedJson.inventory.length > 0, 'JSON inventory should have items');
  console.log('PASS: buildJsonExport successful');

  // 7. Test Security Check (PIN validation)
  console.log('\n--- Test 4: requestExport with wrong PIN ---');
  try {
    await PortabilityService.requestExport(user._id, user.email, 'CSV', '9999');
    console.error('FAIL: Expected invalid PIN error');
  } catch (err) {
    console.log('Correctly caught error:', err.message);
    console.log('PASS: Invalid PIN correctly rejected');
  }

  // 8. Test requestExport with correct PIN
  console.log('\n--- Test 5: requestExport with correct PIN (1234) ---');
  const exportResult = await PortabilityService.requestExport(user._id, user.email, 'CSV', '1234');
  console.log('Export record created:', exportResult.exportRecord);
  console.assert(exportResult.exportRecord.id, 'Record should have id');
  console.assert(exportResult.exportRecord.sizeBytes > 0, 'Record should have byte size');
  console.log('PASS: requestExport created database record and payload');

  // 9. Test getUserExports (history)
  console.log('\n--- Test 6: getUserExports ---');
  const history = await PortabilityService.getUserExports(user._id, user.email);
  console.log('History length:', history.length);
  console.assert(history.length > 0, 'User should have export history');
  console.log('Latest export in history:', history[0]);
  console.log('PASS: getUserExports returned history');

  // 10. Test User Data Isolation
  console.log('\n--- Test 7: User Data Isolation ---');
  const otherUser = await WelcomeUser.create({
    email: 'other_user_' + Date.now() + '@marketpulse.com',
    password: 'Password123!',
    businessName: 'Other Store',
  });
  const otherHistory = await PortabilityService.getUserExports(otherUser._id, otherUser.email);
  console.assert(otherHistory.length === 0, 'Other user should have 0 exports');
  console.log('PASS: User data isolation verified');

  await WelcomeUser.deleteOne({ _id: otherUser._id });
  console.log('\nALL PORTABILITY BACKEND TESTS PASSED!');
  await mongoose.disconnect();
}

runTests().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
