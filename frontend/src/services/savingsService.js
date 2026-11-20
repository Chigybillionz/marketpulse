import apiClient from './api';
import { calculateFinancials, filterTodayTransactions } from './financialEngine';

const LOCAL_SAVINGS_KEY = 'stockpile_savings_records';

/**
 * Get locally cached savings records
 */
export function getLocalSavingsRecords() {
  try {
    const raw = localStorage.getItem(LOCAL_SAVINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

/**
 * Save records locally
 */
export function setLocalSavingsRecords(records) {
  try {
    localStorage.setItem(LOCAL_SAVINGS_KEY, JSON.stringify(records));
  } catch (e) {}
}

const getDayKey = (d = new Date()) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Get Today's Savings Plan & Recommendation
 */
export async function getTodaySavingsPlan(localTransactions = []) {
  try {
    const res = await apiClient('/savings/today');
    if (res && res.recommendation) {
      return res;
    }
  } catch (err) {
    console.warn('API savings endpoint unavailable, using local calculation engine:', err);
  }

  // Graceful local engine fallback
  const now = new Date();
  const dayKey = getDayKey(now);
  const todayTxs = filterTodayTransactions(localTransactions || []);
  const financials = calculateFinancials(todayTxs);

  const { netProfit, salesRevenue, availableCash, totalCashInflow } = financials;
  let status = 'SAVE_TODAY';
  let recommendedAmount = 0;
  let reason = '';

  if (netProfit <= 0 || availableCash <= 0) {
    status = 'DO_NOT_SAVE';
    recommendedAmount = 0;
    if (salesRevenue === 0 && totalCashInflow === 0) {
      reason = 'No sales recorded yet today. Start recording trades to get a personalized savings suggestion.';
    } else if (netProfit < 0) {
      reason = `Shop recorded an outflow/loss of ₦${Math.abs(netProfit).toLocaleString()} today. Prioritize keeping funds in your shop.`;
    } else {
      reason = 'Cash in drawer is low or negative. Protect your liquidity to meet upcoming shop obligations.';
    }
  } else if (netProfit <= 10000 || availableCash < 20000) {
    status = 'SAVE_SMALLER';
    const rawTarget = Math.round((netProfit * 0.1) / 500) * 500 || 500;
    const cashCap = Math.max(500, Math.round((availableCash * 0.15) / 500) * 500);
    recommendedAmount = Math.min(rawTarget, cashCap);
    reason = `You made a modest profit of ₦${netProfit.toLocaleString()} today. Save a gentle ₦${recommendedAmount.toLocaleString()} to build your discipline.`;
  } else {
    status = 'SAVE_TODAY';
    const rawTarget = Math.round((netProfit * 0.2) / 500) * 500 || 1000;
    const cashCap = Math.max(1000, Math.round((availableCash * 0.35) / 500) * 500);
    recommendedAmount = Math.min(rawTarget, cashCap);
    const remainingCash = Math.max(0, availableCash - recommendedAmount);
    reason = `Great day! Net profit is ₦${netProfit.toLocaleString()}. Save ₦${recommendedAmount.toLocaleString()} (20%) and keep ₦${remainingCash.toLocaleString()} for restock and bills.`;
  }

  // Check local saved status
  const localList = getLocalSavingsRecords();
  const existingToday = localList.find((r) => r.dayKey === dayKey);

  return {
    dayKey,
    financials,
    recommendation: {
      status,
      recommendedAmount,
      reason,
      profitPercentage: status === 'SAVE_TODAY' ? 20 : (status === 'SAVE_SMALLER' ? 10 : 0),
    },
    userAction: existingToday?.userAction || {
      status: 'PENDING',
      actualSavedAmount: 0,
    },
  };
}

/**
 * Confirm Today's Savings Decision (Accept, Custom, or Skip)
 */
export async function confirmSavingsDecision(action, customAmount = 0, currentPlan = null) {
  try {
    const res = await apiClient('/savings/confirm', {
      method: 'POST',
      body: JSON.stringify({ action, customAmount }),
    });
    if (res && res.record) {
      return res;
    }
  } catch (err) {
    console.warn('API confirm savings error, saving locally:', err);
  }

  // Local fallback
  const now = new Date();
  const dayKey = getDayKey(now);
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
    actualSaved = currentPlan?.recommendation?.recommendedAmount || 0;
  }

  const newRecord = {
    dayKey,
    date: now.toISOString(),
    financialSnapshot: currentPlan?.financials || {},
    recommendation: currentPlan?.recommendation || {},
    userAction: {
      status: newStatus,
      actualSavedAmount: actualSaved,
      savedAt: now.toISOString(),
    },
  };

  const records = getLocalSavingsRecords();
  const filtered = records.filter((r) => r.dayKey !== dayKey);
  const updated = [newRecord, ...filtered];
  setLocalSavingsRecords(updated);

  return {
    message: newStatus === 'SKIPPED' ? 'Savings skipped for today' : `Saved ₦${actualSaved.toLocaleString()}`,
    record: newRecord,
  };
}

/**
 * Get Savings History
 */
export async function getSavingsHistory() {
  try {
    const res = await apiClient('/savings/history');
    if (Array.isArray(res) && res.length > 0) {
      return res;
    }
  } catch (err) {
    // fallback to local
  }
  return getLocalSavingsRecords();
}

/**
 * Get Cumulative Savings Stats
 */
export async function getSavingsStats() {
  try {
    const res = await apiClient('/savings/stats');
    if (res && res.totalSaved !== undefined) {
      return res;
    }
  } catch (err) {
    // fallback
  }

  const local = getLocalSavingsRecords();
  const now = new Date();
  const day = now.getDay() || 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - day + 1);
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  let totalSaved = 0;
  let savedThisWeek = 0;
  let savedThisMonth = 0;
  let daysCount = 0;

  for (const r of local) {
    const amt = r.userAction?.actualSavedAmount || 0;
    if (amt > 0) {
      totalSaved += amt;
      daysCount += 1;
      const rDate = new Date(r.date);
      if (rDate >= weekStart) savedThisWeek += amt;
      if (rDate >= monthStart) savedThisMonth += amt;
    }
  }

  return {
    totalSaved,
    savedThisWeek,
    savedThisMonth,
    totalDaysSaved: daysCount,
  };
}
