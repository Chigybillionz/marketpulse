const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const WelcomeUser = require('../src/models/WelcomeUser');
const Transaction = require('../src/models/Transaction');
const Product = require('../src/models/Product');
const { signup, getProfileMetrics } = require('../src/services/WelcomeAuthService');

async function runProfileMetricsTests() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketpulse');

  const testEmail = 'metrics_tester_' + Date.now() + '@marketpulse.com';
  const testPassword = 'SecurePassword123!';

  // 1. Sign up test user
  console.log('\n--- Test 1: Sign up user ---');
  const { user } = await signup('Metrics Test Store', testEmail, testPassword);
  console.log('User signed up successfully:', user.email);

  // 2. Test with no data (new user) → 0% growth, 0 low stock
  console.log('\n--- Test 2: New user with no data ---');
  const emptyMetrics = await getProfileMetrics(user._id);
  console.log('Empty metrics:', JSON.stringify(emptyMetrics, null, 2));
  console.assert(emptyMetrics.weeklyGrowth === 0, 'New user growth should be 0%');
  console.assert(emptyMetrics.lowStockCount === 0, 'New user should have 0 low stock items');
  console.assert(emptyMetrics.currentWeekIncome === 0, 'New user current week income should be 0');
  console.assert(emptyMetrics.previousWeekIncome === 0, 'New user previous week income should be 0');
  console.log('PASS: New user shows 0% growth and 0 alerts');

  // 3. Add transactions for previous week
  console.log('\n--- Test 3: Add previous week transactions ---');
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - daysSinceMonday);
  currentWeekStart.setHours(0, 0, 0, 0);

  // Previous week: 3 days ago from start of current week
  const prevWeekDate = new Date(currentWeekStart);
  prevWeekDate.setDate(prevWeekDate.getDate() - 3);

  await Transaction.create([
    { user: user._id, type: 'Income', amount: 5000, category: 'Sales', description: 'Prev week sale 1', date: prevWeekDate },
    { user: user._id, type: 'Income', amount: 3000, category: 'Sales', description: 'Prev week sale 2', date: new Date(prevWeekDate.getTime() + 86400000) },
  ]);
  console.log('Added 2 previous week transactions (total: ₦8,000)');

  // 4. Add transactions for current week
  console.log('\n--- Test 4: Add current week transactions ---');
  const currentWeekDate = new Date(currentWeekStart);
  currentWeekDate.setHours(10, 0, 0, 0);

  await Transaction.create([
    { user: user._id, type: 'Income', amount: 6000, category: 'Sales', description: 'Current week sale 1', date: currentWeekDate },
    { user: user._id, type: 'Income', amount: 4000, category: 'Sales', description: 'Current week sale 2', date: new Date(currentWeekDate.getTime() + 86400000) },
  ]);
  console.log('Added 2 current week transactions (total: ₦10,000)');

  // 5. Calculate weekly growth → (10000 - 8000) / 8000 * 100 = 25%
  console.log('\n--- Test 5: Verify weekly growth calculation ---');
  const growthMetrics = await getProfileMetrics(user._id);
  console.log('Growth metrics:', JSON.stringify(growthMetrics, null, 2));
  console.assert(growthMetrics.currentWeekIncome === 10000, `Current week should be 10000, got ${growthMetrics.currentWeekIncome}`);
  console.assert(growthMetrics.previousWeekIncome === 8000, `Previous week should be 8000, got ${growthMetrics.previousWeekIncome}`);
  console.assert(growthMetrics.weeklyGrowth === 25, `Growth should be 25%, got ${growthMetrics.weeklyGrowth}%`);
  console.log('PASS: Weekly growth correctly calculated as 25%');

  // 6. Add products with low stock
  console.log('\n--- Test 6: Add products with varying stock levels ---');
  await Product.create([
    { user: user._id, name: 'Rice (50kg)', category: 'Grains', price: 25000, quantityInStock: 3, lowStockThreshold: 10 },
    { user: user._id, name: 'Palm Oil (25L)', category: 'Oil', price: 15000, quantityInStock: 8, lowStockThreshold: 10 },
    { user: user._id, name: 'Sugar (1kg)', category: 'Sweeteners', price: 800, quantityInStock: 50, lowStockThreshold: 10 },
    { user: user._id, name: 'Garri (25kg)', category: 'Grains', price: 8000, quantityInStock: 2, lowStockThreshold: 5 },
  ]);
  console.log('Added 4 products: 3 low stock, 1 healthy stock');

  // 7. Verify low stock count
  console.log('\n--- Test 7: Verify low stock alerts ---');
  const stockMetrics = await getProfileMetrics(user._id);
  console.log('Stock metrics:', JSON.stringify(stockMetrics, null, 2));
  console.assert(stockMetrics.lowStockCount === 3, `Low stock count should be 3, got ${stockMetrics.lowStockCount}`);
  console.assert(stockMetrics.lowStockItems.length <= 5, 'Should return at most 5 low stock items');
  console.log('PASS: Inventory alerts correctly identifies 3 low stock products');

  // 8. Test with only current week data (no previous week → 100% growth)
  console.log('\n--- Test 8: Test negative growth scenario ---');
  // Add a large previous week transaction to make growth negative
  const prevWeekDateLate = new Date(currentWeekStart);
  prevWeekDateLate.setDate(prevWeekDateLate.getDate() - 1);
  await Transaction.create({
    user: user._id, type: 'Income', amount: 20000, category: 'Sales', description: 'Big prev week sale', date: prevWeekDateLate
  });

  const negativeMetrics = await getProfileMetrics(user._id);
  console.log('Negative growth metrics:', JSON.stringify(negativeMetrics, null, 2));
  // Previous: 8000 + 20000 = 28000, Current: 10000 → (10000-28000)/28000*100 = -64.3%
  console.assert(negativeMetrics.weeklyGrowth < 0, `Growth should be negative, got ${negativeMetrics.weeklyGrowth}%`);
  console.log('PASS: Negative growth scenario works correctly');

  // 9. Verify expense transactions are not counted
  console.log('\n--- Test 9: Verify expenses are excluded ---');
  await Transaction.create({
    user: user._id, type: 'Expense', amount: 50000, category: 'Purchases', description: 'Stock purchase', date: currentWeekDate
  });
  const expenseMetrics = await getProfileMetrics(user._id);
  console.log('After expense metrics:', JSON.stringify(expenseMetrics, null, 2));
  console.assert(expenseMetrics.currentWeekIncome === 10000, `Expenses should not affect income total, got ${expenseMetrics.currentWeekIncome}`);
  console.log('PASS: Expenses correctly excluded from growth calculation');

  // Cleanup
  console.log('\n--- Cleanup ---');
  await Transaction.deleteMany({ user: user._id });
  await Product.deleteMany({ user: user._id });
  await WelcomeUser.findByIdAndDelete(user._id);
  console.log('Test data cleaned up.');

  console.log('\n✅ ALL PROFILE METRICS TESTS PASSED');
  await mongoose.disconnect();
}

runProfileMetricsTests().catch((err) => {
  console.error('Test failed with error:', err);
  mongoose.disconnect().then(() => process.exit(1));
});
