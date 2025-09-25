// Real API Client - Ready for Backend Integration
// This will replace mockApi when your backend is ready

import { API_ENDPOINTS, httpConfig, addAuthToken, handleApiError } from './config';

// HTTP client (you can replace this with axios or fetch)
const httpClient = async (endpoint, options = {}) => {
  const url = `${httpConfig.baseURL}${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: { ...httpConfig.headers },
    ...options
  };
  
  // Add auth token
  addAuthToken(config);
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

// Real API client implementation
export const realApiClient = {
  // Patient API endpoints
  patients: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `${API_ENDPOINTS.PATIENTS.BASE}?${queryString}`;
      return await httpClient(endpoint);
    },

    getById: async (id) => {
      return await httpClient(API_ENDPOINTS.PATIENTS.BY_ID(id));
    },

    create: async (patientData) => {
      return await httpClient(API_ENDPOINTS.PATIENTS.BASE, {
        method: 'POST',
        body: JSON.stringify(patientData)
      });
    },

    update: async (id, patientData) => {
      return await httpClient(API_ENDPOINTS.PATIENTS.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(patientData)
      });
    },

    delete: async (id) => {
      return await httpClient(API_ENDPOINTS.PATIENTS.BY_ID(id), {
        method: 'DELETE'
      });
    },

    search: async (query) => {
      return await httpClient(`${API_ENDPOINTS.PATIENTS.SEARCH}?q=${query}`);
    }
  },

  // Appointment API endpoints
  appointments: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `${API_ENDPOINTS.APPOINTMENTS.BASE}?${queryString}`;
      return await httpClient(endpoint);
    },

    getById: async (id) => {
      return await httpClient(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
    },

    getByPatient: async (patientId) => {
      return await httpClient(API_ENDPOINTS.APPOINTMENTS.BY_PATIENT(patientId));
    },

    getByDoctor: async (doctorId) => {
      return await httpClient(API_ENDPOINTS.APPOINTMENTS.BY_DOCTOR(doctorId));
    },

    getByDate: async (date) => {
      return await httpClient(`${API_ENDPOINTS.APPOINTMENTS.BY_DATE}?date=${date}`);
    },

    create: async (appointmentData) => {
      return await httpClient(API_ENDPOINTS.APPOINTMENTS.BASE, {
        method: 'POST',
        body: JSON.stringify(appointmentData)
      });
    },

    update: async (id, appointmentData) => {
      return await httpClient(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(appointmentData)
      });
    },

    cancel: async (id, reason) => {
      return await httpClient(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled', reason })
      });
    }
  },

  // Feedback API endpoints
  feedback: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `${API_ENDPOINTS.FEEDBACK.BASE}?${queryString}`;
      return await httpClient(endpoint);
    },

    getById: async (id) => {
      return await httpClient(API_ENDPOINTS.FEEDBACK.BY_ID(id));
    },

    getByPatient: async (patientId) => {
      return await httpClient(API_ENDPOINTS.FEEDBACK.BY_PATIENT(patientId));
    },

    create: async (feedbackData) => {
      return await httpClient(API_ENDPOINTS.FEEDBACK.BASE, {
        method: 'POST',
        body: JSON.stringify(feedbackData)
      });
    },

    getStats: async () => {
      return await httpClient(API_ENDPOINTS.FEEDBACK.STATS);
    }
  },

  // Doctor API endpoints
  doctors: {
    getAll: async () => {
      return await httpClient(API_ENDPOINTS.DOCTORS.BASE);
    },

    getById: async (id) => {
      return await httpClient(API_ENDPOINTS.DOCTORS.BY_ID(id));
    },

    getAvailability: async (id, date) => {
      return await httpClient(`${API_ENDPOINTS.DOCTORS.AVAILABILITY(id)}?date=${date}`);
    }
  },

  // Analytics API endpoints
  analytics: {
    getDashboard: async () => {
      return await httpClient(API_ENDPOINTS.ANALYTICS.DASHBOARD);
    },

    getPatientStats: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await httpClient(`${API_ENDPOINTS.ANALYTICS.PATIENTS}?${queryString}`);
    },

    getAppointmentStats: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await httpClient(`${API_ENDPOINTS.ANALYTICS.APPOINTMENTS}?${queryString}`);
    },

    getFeedbackStats: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await httpClient(`${API_ENDPOINTS.ANALYTICS.FEEDBACK}?${queryString}`);
    }
  },

  // Authentication API endpoints
  auth: {
    login: async (credentials) => {
      return await httpClient(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    },

    register: async (userData) => {
      return await httpClient(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    logout: async () => {
      return await httpClient(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST'
      });
    },

    refreshToken: async (refreshToken) => {
      return await httpClient(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });
    },

    getProfile: async () => {
      return await httpClient(API_ENDPOINTS.AUTH.PROFILE);
    }
  }
};