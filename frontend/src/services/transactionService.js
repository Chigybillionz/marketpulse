import apiClient from './api';

/**
 * Creates a new transaction
 */
export const createTransaction = async (transactionData) => {
  return apiClient('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
};

/**
 * Fetches all transactions for the logged in user
 */
export const getTransactions = async () => {
  return apiClient('/transactions', {
    method: 'GET',
  });
};
