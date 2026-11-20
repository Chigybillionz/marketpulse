const SavingsRecord = require('../models/SavingsRecord');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { calculateFinancials } = require('../utils/financialEngine');

const getDayKey = (d = new Date()) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Generate intelligent savings recommendation based on audited financials
 */
function generateSavingsRecommendation(financials) {
  const { netProfit, salesRevenue, availableCash, totalCashInflow, totalCashOutflow } = financials;

  // 1. Loss or Negative Cash Flow
  if (netProfit <= 0 || availableCash <= 0) {
    let reason = "Keep all money in your business today to protect your shop's seed capital.";
    if (salesRevenue === 0 && totalCashInflow === 0) {
      reason = "No sales recorded yet today. Start recording your trades to get a personalized savings suggestion.";
    } else if (netProfit < 0) {
      reason = `Shop recorded an outflow/loss of ₦${Math.abs(netProfit).toLocaleString()} today. Prioritize preserving working capital over saving.`;
    } else if (availableCash <= 0) {
      reason = "Cash in drawer is low or negative. Keep all incoming cash to handle upcoming supplier and shop bills.";
    }

    return {
      status: 'DO_NOT_SAVE',
      recommendedAmount: 0,
      reason,
      profitPercentage: 0,
    };
  }

  // 2. Small Profit or Tight Cash
  if (netProfit <= 10000 || availableCash < 20000) {
    const rawTarget = Math.round((netProfit * 0.1) / 500) * 500 || 500;
    const cashCap = Math.max(500, Math.round((availableCash * 0.15) / 500) * 500);
    const recommendedAmount = Math.min(rawTarget, cashCap);

    return {
      status: 'SAVE_SMALLER',
      recommendedAmount,
      reason: `You made a modest profit of ₦${netProfit.toLocaleString()} today. Save a gentle ₦${recommendedAmount.toLocaleString()} to build consistency without stressing your shop's cash float.`,
      profitPercentage: 10,
    };
  }

  // 3. Strong Profit and Healthy Cash Surplus
  const rawTarget = Math.round((netProfit * 0.2) / 500) * 500 || 1000;
  const cashCap = Math.max(1000, Math.round((availableCash * 0.35) / 500) * 500);
  const recommendedAmount = Math.min(rawTarget, cashCap);
  const remainingCash = Math.max(0, availableCash - recommendedAmount);

  return {
    status: 'SAVE_TODAY',
    recommendedAmount,
    reason: `Great trading day! Net profit is ₦${netProfit.toLocaleString()} with good cash in hand. We suggest saving ₦${recommendedAmount.toLocaleString()} (20%) and keeping ₦${remainingCash.toLocaleString()} for restock and bills.`,
    profitPercentage: 20,
  };
}

// @desc    Get today's savings analysis & recommendation
// @route   GET /api/savings/today
// @access  Private
const getTodaySavingsPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const dayKey = getDayKey(now);

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // 1. Fetch today's transactions
    const todayTransactions = await Transaction.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    // 2. Fetch all-time balance up to today to estimate available cash
    const allTxs = await Transaction.find({ user: userId }).lean();
    let cumulativeCash = 0;
    for (const t of allTxs) {
      const amt = Number(t.amount) || 0;
      if (t.type === 'Income' || t.isCreditRecovery) cumulativeCash += amt;
      else cumulativeCash -= amt;
    }

    const products = await Product.find({ user: userId }).lean();
    const financials = calculateFinancials(todayTransactions, {
      productCatalog: products,
      previousCashBalance: Math.max(0, cumulativeCash - (todayTransactions.reduce((acc, t) => acc + (t.type === 'Income' ? t.amount : -t.amount), 0))),
    });

    // 3. Generate dynamic recommendation
    const recommendation = generateSavingsRecommendation(financials);

    // 4. Check if a record already exists in database for today
    let record = await SavingsRecord.findOne({ user: userId, dayKey });

    if (!record) {
      record = await SavingsRecord.create({
        user: userId,
        dayKey,
        date: now,
        financialSnapshot: {
          salesRevenue: financials.salesRevenue,
          cogs: financials.totalCogs,
          operatingExpenses: financials.operatingExpenses,
          netProfit: financials.netProfit,
          totalCashInflow: financials.totalCashInflow,
          totalCashOutflow: financials.totalCashOutflow,
          netCashFlow: financials.netCashFlow,
          availableCash: financials.availableCash,
        },
        recommendation,
        userAction: {
          status: 'PENDING',
          actualSavedAmount: 0,
        },
      });
    } else {
      // If user hasn't confirmed saving yet, refresh the dynamic calculation
      if (record.userAction.status === 'PENDING') {
        record.financialSnapshot = {
          salesRevenue: financials.salesRevenue,
          cogs: financials.totalCogs,
          operatingExpenses: financials.operatingExpenses,
          netProfit: financials.netProfit,
          totalCashInflow: financials.totalCashInflow,
          totalCashOutflow: financials.totalCashOutflow,
          netCashFlow: financials.netCashFlow,
          availableCash: financials.availableCash,
        };
        record.recommendation = recommendation;
        await record.save();
      }
    }

    res.status(200).json({
      dayKey,
      financials,
      recommendation: record.recommendation,
      userAction: record.userAction,
      recordId: record._id,
    });
  } catch (error) {
    console.error('Error in getTodaySavingsPlan:', error);
    res.status(500).json({ message: 'Server error retrieving today savings plan' });
  }
};

// @desc    Confirm today's savings decision (Accept, Custom amount, or Skip)
// @route   POST /api/savings/confirm
// @access  Private
const confirmSavings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { action, customAmount, notes } = req.body; // action: 'SAVE_RECOMMENDED' | 'SAVE_CUSTOM' | 'SKIP'
    const now = new Date();
    const dayKey = getDayKey(now);

    let record = await SavingsRecord.findOne({ user: userId, dayKey });
    if (!record) {
      return res.status(404).json({ message: 'No savings record found for today' });
    }

    let actualSaved = 0;
    let newStatus = 'SAVED';

    if (action === 'SKIP') {
      newStatus = 'SKIPPED';
      actualSaved = 0;
    } else if (action === 'SAVE_CUSTOM') {
      newStatus = 'CUSTOM_SAVED';
      actualSaved = Math.max(0, Number(customAmount) || 0);
    } else {
      newStatus = 'SAVED';
      actualSaved = record.recommendation?.recommendedAmount || 0;
    }

    record.userAction = {
      status: newStatus,
      actualSavedAmount: actualSaved,
      savedAt: now,
      notes: notes || '',
    };

    await record.save();

    res.status(200).json({
      message: newStatus === 'SKIPPED' ? 'Savings skipped for today' : `Successfully saved ₦${actualSaved.toLocaleString()}`,
      record,
    });
  } catch (error) {
    console.error('Error confirming savings:', error);
    res.status(500).json({ message: 'Server error saving decision' });
  }
};

// @desc    Get savings history
// @route   GET /api/savings/history
// @access  Private
const getSavingsHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await SavingsRecord.find({ user: userId })
      .sort({ date: -1 })
      .limit(60)
      .lean();

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching savings history:', error);
    res.status(500).json({ message: 'Server error retrieving history' });
  }
};

// @desc    Get cumulative savings metrics (Total saved, this week, this month)
// @route   GET /api/savings/stats
// @access  Private
const getSavingsStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Start of week (Monday)
    const day = now.getDay() || 7;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - day + 1);
    weekStart.setHours(0, 0, 0, 0);

    // Start of month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    const allRecords = await SavingsRecord.find({
      user: userId,
      'userAction.status': { $in: ['SAVED', 'CUSTOM_SAVED'] },
    }).lean();

    let totalSaved = 0;
    let savedThisWeek = 0;
    let savedThisMonth = 0;

    for (const r of allRecords) {
      const amt = r.userAction?.actualSavedAmount || 0;
      totalSaved += amt;

      const rDate = new Date(r.date);
      if (rDate >= weekStart) savedThisWeek += amt;
      if (rDate >= monthStart) savedThisMonth += amt;
    }

    res.status(200).json({
      totalSaved,
      savedThisWeek,
      savedThisMonth,
      totalDaysSaved: allRecords.length,
    });
  } catch (error) {
    console.error('Error calculating savings stats:', error);
    res.status(500).json({ message: 'Server error calculating stats' });
  }
};

module.exports = {
  getTodaySavingsPlan,
  confirmSavings,
  getSavingsHistory,
  getSavingsStats,
  generateSavingsRecommendation,
};
