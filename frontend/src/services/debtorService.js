import apiClient from './api';

export const getDebtors = async (email) => {
  return apiClient(`/debtors?email=${encodeURIComponent(email)}`, {
    method: 'GET',
  });
};

export const addCreditTransaction = async (email, customerName, phoneNumber, amount, description, dueDate) => {
  return apiClient('/debtors/credit', {
    method: 'POST',
    body: JSON.stringify({ email, customerName, phoneNumber, amount, description, dueDate }),
  });
};

export const logRepayment = async (debtorId, amount, description, email) => {
  return apiClient(`/debtors/${debtorId}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ amount, description, email }),
  });
};

/**
 * Resolves an active credit (supports partial or full settlement)
 * and records an incoming financial transaction in sales/revenue.
 */
export const resolveCredit = async (debtorId, amount, description, email) => {
  return apiClient(`/debtors/${debtorId}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ amount, description, email }),
  });
};

/**
 * Logs a reminder for a debtor and checks 24h cooldown
 */
export const logReminder = async (debtorId, email, channel, message) => {
  return apiClient(`/debtors/${debtorId}/remind`, {
    method: 'POST',
    body: JSON.stringify({ email, channel, message }),
  });
};
