const { calculateFinancials, classifyTransaction } = require('../src/utils/financialEngine');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--------------------------------------------------');
console.log('🧪 TESTING STOCKPILE FINANCIAL CALCULATION ENGINE');
console.log('--------------------------------------------------\n');

// ── TEST 1: Profitable Day ───────────────────────────────────────
console.log('Test 1: Profitable Day (Sales ₦50,000, COGS ₦35,000, Shop Rent ₦5,000)');
{
  const txs = [
    { type: 'Income', amount: 50000, category: 'Sales', description: 'Sold provisions' },
    { type: 'Expense', amount: 5000, category: 'Operating', description: 'Shop rent daily contribution' }
  ];
  const catalog = [{ name: 'provisions', costPrice: 35000 }];
  const res = calculateFinancials(txs, { productCatalog: catalog });

  assert(res.salesRevenue === 50000, `Sales Revenue should be 50,000, got ${res.salesRevenue}`);
  assert(res.operatingExpenses === 5000, `Operating expenses should be 5,000, got ${res.operatingExpenses}`);
  assert(res.grossProfit > 0, `Gross profit should be positive, got ${res.grossProfit}`);
  assert(res.netProfit > 0, `Net profit should be positive, got ${res.netProfit}`);
  assert(res.netCashFlow === 45000, `Net cash flow should be 45,000, got ${res.netCashFlow}`);
}

// ── TEST 2: Loss-Making Day ──────────────────────────────────────
console.log('\nTest 2: Loss-Making Day (Sales ₦10,000, COGS ₦7,500, Fuel & Generator ₦15,000)');
{
  const txs = [
    { type: 'Income', amount: 10000, category: 'Sales', description: 'Sold biscuits' },
    { type: 'Expense', amount: 15000, category: 'Utilities', description: 'Generator fuel' }
  ];
  const res = calculateFinancials(txs);

  assert(res.salesRevenue === 10000, `Sales Revenue should be 10,000, got ${res.salesRevenue}`);
  assert(res.operatingExpenses === 15000, `Operating expenses should be 15,000, got ${res.operatingExpenses}`);
  assert(res.netProfit < 0, `Net profit should be NEGATIVE (loss), got ${res.netProfit}`);
  assert(res.isProfitable === false, `isProfitable should be false`);
}

// ── TEST 3: Inventory Restocking Day ─────────────────────────────
console.log('\nTest 3: Inventory Restock Day (Bought ₦150k Stock, Sold ₦40k with ₦10k Profit)');
{
  // Trader spends 150,000 buying rice for stock.
  // Trader sells 40,000 worth of goods that cost 30,000.
  // In the old flawed engine, this would report -₦110,000 LOSS!
  // In our audited engine, Net Profit MUST BE POSITIVE +₦10,000!
  const txs = [
    { type: 'Expense', amount: 150000, category: 'Restock', description: 'Purchased 5 bags of rice restock' },
    { type: 'Income', amount: 40000, category: 'Dry Goods', description: 'Sold 1 bag of rice', costPrice: 30000, quantity: 1 }
  ];
  const res = calculateFinancials(txs);

  assert(res.inventoryPurchases === 150000, `Inventory purchases should be 150,000, got ${res.inventoryPurchases}`);
  assert(res.salesRevenue === 40000, `Sales revenue should be 40,000, got ${res.salesRevenue}`);
  assert(res.totalCogs === 30000, `COGS should be 30,000, got ${res.totalCogs}`);
  assert(res.netProfit === 10000, `Net profit should be +10,000, got ${res.netProfit}`);
  assert(res.isProfitable === true, `Business was profitable despite stock purchase!`);
  assert(res.netCashFlow === -110000, `Cash flow correctly reflects money spent on stock (-110,000)`);
}

// ── TEST 4: Credit Sale ──────────────────────────────────────────
console.log('\nTest 4: Credit Sale (Sold ₦25,000 goods on credit, cost was ₦18,000)');
{
  const txs = [
    { type: 'Income', amount: 25000, financialClass: 'CREDIT_SALE', description: 'Credit sale to Mama Tunde', costPrice: 18000 }
  ];
  const res = calculateFinancials(txs);

  assert(res.salesRevenue === 25000, `Credit sale should be counted as sales revenue (25,000), got ${res.salesRevenue}`);
  assert(res.creditSales === 25000, `Credit sales tracked separately, got ${res.creditSales}`);
  assert(res.cashSales === 0, `Immediate cash sales should be 0, got ${res.cashSales}`);
  assert(res.totalCashInflow === 0, `No cash entered the drawer today, got ${res.totalCashInflow}`);
  assert(res.netProfit === 7000, `Net profit should be recognized on sale (+7,000), got ${res.netProfit}`);
}

// ── TEST 5: Subsequent Credit Repayment (Collection) ──────────────
console.log('\nTest 5: Credit Repayment Collection (Customer pays ₦25,000 debt)');
{
  const txs = [
    { type: 'Income', amount: 25000, isCreditRecovery: true, description: 'Debt payment from Mama Tunde' }
  ];
  const res = calculateFinancials(txs);

  assert(res.salesRevenue === 0, `Credit collection must NOT be counted as new sales revenue! Got ${res.salesRevenue}`);
  assert(res.creditRecoveries === 25000, `Credit recovery tracked as cash inflow, got ${res.creditRecoveries}`);
  assert(res.totalCashInflow === 25000, `Cash inflow should be 25,000, got ${res.totalCashInflow}`);
  assert(res.netCashFlow === 25000, `Net cash flow increased by 25,000`);
  assert(res.netProfit === 0, `Repayment of debt does not inflate today's sales profit, got ${res.netProfit}`);
}

// ── TEST 6: Bank Loan / Borrowed Money ────────────────────────────
console.log('\nTest 6: Borrowed Money (Loan Inflow ₦200,000)');
{
  const txs = [
    { type: 'Income', amount: 200000, category: 'Loan', description: 'Loan from cooperative' }
  ];
  const res = calculateFinancials(txs);

  assert(res.salesRevenue === 0, `Loan must NEVER be counted as business revenue! Got ${res.salesRevenue}`);
  assert(res.loansBorrowed === 200000, `Loan recognized as financing inflow, got ${res.loansBorrowed}`);
  assert(res.totalCashInflow === 200000, `Cash inflow increased by 200,000`);
  assert(res.netProfit === 0, `Loan is NOT profit! Got ${res.netProfit}`);
}

// ── TEST 7: Personal Cash Withdrawal (Chop Money) ─────────────────
console.log('\nTest 7: Personal Cash Withdrawal (Chop money ₦10,000)');
{
  const txs = [
    { type: 'Expense', amount: 10000, category: 'Personal', description: 'Took home chop money' }
  ];
  const res = calculateFinancials(txs);

  assert(res.personalWithdrawals === 10000, `Personal withdrawal recognized, got ${res.personalWithdrawals}`);
  assert(res.operatingExpenses === 0, `Chop money is NOT an operating expense of the shop! Got ${res.operatingExpenses}`);
  assert(res.totalCashOutflow === 10000, `Cash left the drawer (-10,000), got ${res.totalCashOutflow}`);
  assert(res.netProfit === 0, `Shop trading profit was not penalized, got ${res.netProfit}`);
}

// ── TEST 8: Full Day Multi-Transaction Simulation ────────────────
console.log('\nTest 8: Full Day Multi-Transaction Simulation');
{
  const txs = [
    { type: 'Income', amount: 80000, category: 'Sales', description: 'Cash sales for the day', costPrice: 60000 },
    { type: 'Income', amount: 20000, financialClass: 'CREDIT_SALE', description: 'Credit sale to Chinedu', costPrice: 15000 },
    { type: 'Income', amount: 15000, isCreditRecovery: true, description: 'Credit repayment from Amina' },
    { type: 'Expense', amount: 50000, category: 'Restock', description: 'Bought 2 cartons soap restock' },
    { type: 'Expense', amount: 6000, category: 'Operating', description: 'Shop generator fuel' },
    { type: 'Expense', amount: 4000, category: 'Personal', description: 'Chop money' },
  ];

  const res = calculateFinancials(txs, { previousCashBalance: 20000 });

  // Revenue: 80k cash sale + 20k credit sale = 100k
  assert(res.salesRevenue === 100000, `Total Revenue should be 100,000, got ${res.salesRevenue}`);
  // COGS: 60k + 15k = 75k
  assert(res.totalCogs === 75000, `Total COGS should be 75,000, got ${res.totalCogs}`);
  // Gross Profit: 100k - 75k = 25k
  assert(res.grossProfit === 25000, `Gross Profit should be 25,000, got ${res.grossProfit}`);
  // Operating Expenses: 6k fuel
  assert(res.operatingExpenses === 6000, `Operating expenses should be 6,000, got ${res.operatingExpenses}`);
  // Net Profit: 25k - 6k = 19k
  assert(res.netProfit === 19000, `Net Profit should be 19,000, got ${res.netProfit}`);

  // Cash Inflow: 80k cash sales + 15k credit recovery = 95k
  assert(res.totalCashInflow === 95000, `Cash Inflow should be 95,000, got ${res.totalCashInflow}`);
  // Cash Outflow: 50k restock + 6k fuel + 4k chop money = 60k
  assert(res.totalCashOutflow === 60000, `Cash Outflow should be 60,000, got ${res.totalCashOutflow}`);
  // Net Cash Flow: 95k - 60k = +35k
  assert(res.netCashFlow === 35000, `Net Cash Flow should be +35,000, got ${res.netCashFlow}`);
  // Available Cash: 20k prev + 35k = 55k
  assert(res.availableCash === 55000, `Available Cash should be 55,000, got ${res.availableCash}`);
}

console.log('\n🎉 ALL 8 SCENARIOS PASSED WITH 100% ACCOUNTING ACCURACY!');
