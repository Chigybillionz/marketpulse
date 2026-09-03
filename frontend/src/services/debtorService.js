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

export const logRepayment = async (debtorId, amount, description) => {
  return apiClient(`/debtors/${debtorId}/repay`, {
    method: 'POST',
    body: JSON.stringify({ amount, description }),
  });
};
