// Main API Interface - Seamless Mock/Real API Switching
// This file provides a unified interface that automatically switches between mock and real API

import { USE_MOCK_API } from './config';
import { apiClient as mockApiClient } from './mockApi';
import { realApiClient } from './realApi';

// API interface that switches between mock and real implementation
const createApiInterface = () => {
  if (USE_MOCK_API) {
    console.log('🚀 Using Mock API for development');
    return mockApiClient;
  } else {
    console.log('🌐 Using Real API backend');
    return realApiClient;
  }
};

// Main API client - automatically switches based on configuration
export const api = createApiInterface();

// Utility functions for API operations
export const apiUtils = {
  // Handle API responses consistently
  handleResponse: (response) => {
    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || 'API request failed');
    }
  },

  // Format error messages for user display
  formatError: (error) => {
    if (typeof error === 'string') {
      return error;
    }
    return error.message || 'An unexpected error occurred';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('mediAssistToken');
    return !!token;
  },

  // Get current user from storage
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('mediAssistUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem('mediAssistToken');
    localStorage.removeItem('mediAssistUser');
  },

  // Set authentication data
  setAuth: (userData, token) => {
    localStorage.setItem('mediAssistToken', token);
    localStorage.setItem('mediAssistUser', JSON.stringify(userData));
  }
};

// Export individual API modules for specific use cases
export const patientApi = api.patients;
export const appointmentApi = api.appointments;
export const feedbackApi = api.feedback;
export const doctorApi = api.doctors;
export const analyticsApi = api.analytics;
export const authApi = api.auth;

// Default export for general use
export default api;

// Backend Integration Guide for Developers
export const BACKEND_INTEGRATION_GUIDE = {
  steps: [
    '1. Set USE_MOCK_API to false in src/api/config.js',
    '2. Update API_BASE_URL in src/api/config.js to your backend URL',
    '3. Ensure your backend endpoints match those defined in API_ENDPOINTS',
    '4. Test all API endpoints with your backend',
    '5. Update authentication flow if needed'
  ],
  
  requiredBackendEndpoints: [
    'POST /auth/login',
    'POST /auth/register',
    'GET /patients',
    'POST /patients',
    'GET /patients/:id',
    'PUT /patients/:id',
    'GET /appointments',
    'POST /appointments',
    'GET /appointments/:id',
    'PUT /appointments/:id',
    'GET /feedback',
    'POST /feedback',
    'GET /doctors',
    'GET /analytics/dashboard'
  ],
  
  expectedResponseFormat: {
    success: true,
    data: {}, // or []
    message: 'Optional success message',
    total: 'Optional total count for pagination',
    page: 'Optional current page',
    limit: 'Optional page size'
  },
  
  errorResponseFormat: {
    success: false,
    message: 'Error description',
    error: 'Optional detailed error info'
  }
};

// Development helpers
export const devHelpers = {
  // Switch to mock API (for development)
  useMockApi: () => {
    console.log('Switching to Mock API mode');
    // Note: This would require a page refresh in production
    // In development, you can modify config.js directly
  },
  
  // Switch to real API (for production)
  useRealApi: () => {
    console.log('Switching to Real API mode');
    // Note: This would require updating config.js
  },
  
  // Test API connection
  testConnection: async () => {
    try {
      const response = await api.analytics.getDashboard();
      console.log('API Connection Test:', response.success ? '✅ Success' : '❌ Failed');
      return response.success;
    } catch (error) {
      console.log('API Connection Test: ❌ Failed -', error.message);
      return false;
    }
  }
};