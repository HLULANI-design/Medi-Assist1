// API Configuration - Easy Backend Integration
// Switch between mock and real API by changing USE_MOCK_API

// Environment configuration
const USE_MOCK_API = true; // Set to false when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API_VERSION = 'v1';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  
  // Patient endpoints
  PATIENTS: {
    BASE: '/patients',
    BY_ID: (id) => `/patients/${id}`,
    SEARCH: '/patients/search'
  },
  
  // Appointment endpoints
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id) => `/appointments/${id}`,
    BY_PATIENT: (patientId) => `/appointments/patient/${patientId}`,
    BY_DOCTOR: (doctorId) => `/appointments/doctor/${doctorId}`,
    BY_DATE: '/appointments/by-date'
  },
  
  // Feedback endpoints
  FEEDBACK: {
    BASE: '/feedback',
    BY_ID: (id) => `/feedback/${id}`,
    BY_PATIENT: (patientId) => `/feedback/patient/${patientId}`,
    STATS: '/feedback/stats'
  },
  
  // Doctor endpoints
  DOCTORS: {
    BASE: '/doctors',
    BY_ID: (id) => `/doctors/${id}`,
    AVAILABILITY: (id) => `/doctors/${id}/availability`
  },
  
  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    PATIENTS: '/analytics/patients',
    APPOINTMENTS: '/analytics/appointments',
    FEEDBACK: '/analytics/feedback'
  }
};

// HTTP client configuration
export const httpConfig = {
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Request interceptor for adding auth token
export const addAuthToken = (config) => {
  const token = localStorage.getItem('mediAssistToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor for handling errors
export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('mediAssistToken');
    localStorage.removeItem('mediAssistUser');
    window.location.href = '/login';
  }
  
  return {
    success: false,
    message: error.response?.data?.message || 'An error occurred',
    error: error.response?.data || error.message
  };
};

// Export configuration flag
export { USE_MOCK_API, API_BASE_URL, API_VERSION };