// src/services/api.js
import axios from 'axios';

// Fallback for environments where process.env is not available
const getEnvVariable = (key, defaultValue) => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // For browser environment, use a fallback
    return window._env_?.[key] || defaultValue;
  }
  
  // For Node.js environment, use process.env
  return process.env?.[key] || defaultValue;
};

const API_BASE_URL = getEnvVariable('REACT_APP_API_BASE_URL', 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create order
export const createOrder = (data, idempotencyKey) => {
  const headers = {};
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  return api.post('/payments/create-order', data, { headers });
};

// Verify payment
export const verifyPayment = (paymentData) => {
  return api.post('/payments/verify', paymentData);
};

// Optional: webhook simulator in sandbox
export const simulateWebhook = (payload) => api.post('/payments/webhook', payload, {
  headers: { 'Content-Type': 'application/json' }
});

export default api;