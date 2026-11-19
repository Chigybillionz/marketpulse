/**
 * Stockpile Financial Calculation Engine
 * 
 * Provides mathematically accurate retail accounting separating:
 * 1. Revenue vs Financing/Recoveries (Loans, Credit Repayments)
 * 2. Cost of Goods Sold (COGS) vs Operating Expenses vs Capital Outflows (Restock, Personal Withdrawals)
 * 3. Gross Profit & Net Profit vs Net Cash Flow
 */

// Default estimated retail cost percentage if cost price was not explicitly recorded (e.g. 75% cost = 25% margin)
const DEFAULT_ESTIMATED_COST_RATIO = 0.75;

/**
 * Classifies a transaction into standard business financial classes
 */
function classifyTransaction(tx) {
  if (tx.financialClass) return tx.financialClass;

  const desc = (tx.description || '').toLowerCase();
  const cat = (tx.category || '').toLowerCase();
  const source = (tx.source || '').toLowerCase();
  const isCreditRec = Boolean(
    tx.isCreditRecovery ||
    cat.includes('credit repayment') ||
    source.includes('credit payment') ||
    desc.includes('debt recovered') ||
    desc.includes('debt payment')
  );

  if (isCreditRec) {
    return 'CREDIT_REPAYMENT';
  }

  // Explicit CREDIT sale checks
  if (
    tx.type === 'CREDIT' ||
    cat.includes('credit sale') ||
    desc.includes('credit given') ||
    desc.includes('credit sale') ||
    desc.includes('owe me')
  ) {
    return 'CREDIT_SALE';
  }

  if (tx.type === 'Income') {
    if (cat.includes('loan') || desc.includes('loan') || desc.includes('borrowed') || cat.includes('borrow')) {
      return 'LOAN_BORROWED';
    }
    if (cat.includes('capital') || desc.includes('capital injection') || desc.includes('investment') || desc.includes('deposit')) {
      return 'CAPITAL_INJECTION';
    }
    return 'SALES_REVENUE';
  }

  // Expense
  if (tx.type === 'Expense') {
    if (
      cat.includes('restock') ||
      cat.includes('inventory') ||
      cat.includes('stock') ||
      cat.includes('goods purchase') ||
      desc.includes('restock') ||
      desc.includes('bought stock') ||
      desc.includes('purchased goods') ||
      source.includes('restock')
    ) {
      return 'INVENTORY_RESTOCK';
    }
    if (
      cat.includes('personal') ||
      cat.includes('drawings') ||
      cat.includes('chop money') ||
      desc.includes('chop money') ||
      desc.includes('personal') ||
      desc.includes('took home') ||
      desc.includes('family') ||
      desc.includes('house money') ||
      desc.includes('pocket money')
    ) {
      return 'PERSONAL_WITHDRAWAL';
    }
    if (
      cat.includes('lent') ||
      cat.includes('loan given') ||
      desc.includes('lent money') ||
      desc.includes('loan to')
    ) {
      return 'LOAN_LENT';
    }
    if (
      cat.includes('loan repayment') ||
      desc.includes('paid bank') ||
      desc.includes('repaid loan')
    ) {
      return 'LOAN_REPAYMENT';
    }
    // Default operating expense (shop rent, fuel, transport, security, electricity, maintenance, packaging)
    return 'OPERATING_EXPENSE';
  }

  return 'OPERATING_EXPENSE';
}

/**
 * Computes Cost of Goods Sold for a sale transaction
 */
function computeCogsForTransaction(tx, productCatalog = []) {
  if (tx.cogs !== undefined && tx.cogs > 0) return Number(tx.cogs);
  if (tx.costPrice !== undefined && tx.costPrice > 0) {
    return Number(tx.costPrice) * (Number(tx.quantity) || 1);
  }

  // Look up in product catalog if matching name
  const desc = (tx.description || '').toLowerCase();
  const matched = (productCatalog || []).find(p => p?.name && desc.includes(p.name.toLowerCase()));
  if (matched && matched.costPrice > 0) {
    const qty = Number(tx.quantity) || 1;
    return matched.costPrice * qty;
  }

  // Fallback: estimate cost based on retail margin
  const amount = Number(tx.amount) || 0;
  return Math.round(amount * DEFAULT_ESTIMATED_COST_RATIO);
}

/**
 * Computes complete financial analytics for a collection of transactions
 */
function calculateFinancials(transactions = [], options = {}) {
  const { productCatalog = [], previousCashBalance = 0 } = options;

  let salesRevenue = 0;
  let creditSales = 0;
  let totalCogs = 0;
  let operatingExpenses = 0;
  let otherIncome = 0;

  // Cash Flow components
  let cashSales = 0;
  let creditRecoveries = 0;
  let loansBorrowed = 0;
  let capitalInjections = 0;
  let inventoryPurchases = 0;
  let personalWithdrawals = 0;
  let loansLent = 0;
  let loanRepayments = 0;
  let cashOperatingExpenses = 0;

  const categorizedBreakdown = {
    revenue: [],
    cogs: [],
    operatingExpenses: [],
    inventoryPurchases: [],
    personalWithdrawals: [],
    creditRepayments: [],
    loansAndFinancing: [],
  };

  for (const rawTx of transactions) {
    const amount = Number(rawTx.amount) || 0;
    const fClass = classifyTransaction(rawTx);
    const tx = { ...rawTx, financialClass: fClass, computedAmount: amount };

    switch (fClass) {
      case 'SALES_REVENUE':
        salesRevenue += amount;
        cashSales += amount;
        const cogsAmount = computeCogsForTransaction(rawTx, productCatalog);
        totalCogs += cogsAmount;
        categorizedBreakdown.revenue.push(tx);
        break;

      case 'CREDIT_SALE':
        salesRevenue += amount;
        creditSales += amount;
        const creditCogs = computeCogsForTransaction(rawTx, productCatalog);
        totalCogs += creditCogs;
        categorizedBreakdown.revenue.push(tx);
        break;

      case 'CREDIT_REPAYMENT':
        // Cash collected from previous debtors - increases cash, NOT new sales revenue
        creditRecoveries += amount;
        categorizedBreakdown.creditRepayments.push(tx);
        break;

      case 'LOAN_BORROWED':
        loansBorrowed += amount;
        categorizedBreakdown.loansAndFinancing.push(tx);
        break;

      case 'CAPITAL_INJECTION':
        capitalInjections += amount;
        categorizedBreakdown.loansAndFinancing.push(tx);
        break;

      case 'OTHER_INCOME':
        otherIncome += amount;
        cashSales += amount;
        categorizedBreakdown.revenue.push(tx);
        break;

      case 'INVENTORY_RESTOCK':
        // Inventory purchase - cash outflow into inventory asset, NOT immediate P&L expense
        inventoryPurchases += amount;
        categorizedBreakdown.inventoryPurchases.push(tx);
        break;

      case 'OPERATING_EXPENSE':
        // Real shop operating expense (fuel, rent, transport, repairs)
        operatingExpenses += amount;
        cashOperatingExpenses += amount;
        categorizedBreakdown.operatingExpenses.push(tx);
        break;

      case 'PERSONAL_WITHDRAWAL':
        // Owner personal drawings/chop money - cash reduction, not shop operating expense
        personalWithdrawals += amount;
        categorizedBreakdown.personalWithdrawals.push(tx);
        break;

      case 'LOAN_LENT':
        loansLent += amount;
        categorizedBreakdown.loansAndFinancing.push(tx);
        break;

      case 'LOAN_REPAYMENT':
        loanRepayments += amount;
        categorizedBreakdown.loansAndFinancing.push(tx);
        break;

      case 'OTHER_EXPENSE':
      default:
        operatingExpenses += amount;
        cashOperatingExpenses += amount;
        categorizedBreakdown.operatingExpenses.push(tx);
        break;
    }
  }

  // Profit Calculations
  const grossProfit = salesRevenue - totalCogs;
  const netProfit = grossProfit - operatingExpenses + otherIncome;
  const grossMarginPercent = salesRevenue > 0 ? ((grossProfit / salesRevenue) * 100).toFixed(1) : '0.0';
  const netMarginPercent = salesRevenue > 0 ? ((netProfit / salesRevenue) * 100).toFixed(1) : '0.0';

  // Cash Flow Calculations
  const totalCashInflow = cashSales + creditRecoveries + loansBorrowed + capitalInjections;
  const totalCashOutflow = inventoryPurchases + cashOperatingExpenses + personalWithdrawals + loansLent + loanRepayments;
  const netCashFlow = totalCashInflow - totalCashOutflow;
  const availableCash = previousCashBalance + netCashFlow;

  return {
    // 1. Core Profit & Loss Metrics
    salesRevenue,
    creditSales,
    totalCogs,
    grossProfit,
    operatingExpenses,
    otherIncome,
    netProfit,
    isProfitable: netProfit >= 0,
    grossMarginPercent: Number(grossMarginPercent),
    netMarginPercent: Number(netMarginPercent),

    // 2. Cash Flow & Liquidity Metrics
    totalCashInflow,
    totalCashOutflow,
    netCashFlow,
    isCashFlowPositive: netCashFlow >= 0,
    availableCash,

    // 3. Breakdown Categories
    cashSales,
    creditRecoveries,
    loansBorrowed,
    capitalInjections,
    inventoryPurchases,
    personalWithdrawals,
    cashOperatingExpenses,
    loansLent,
    loanRepayments,

    categorizedBreakdown,
  };
}

module.exports = {
  classifyTransaction,
  computeCogsForTransaction,
  calculateFinancials,
  DEFAULT_ESTIMATED_COST_RATIO,
};
