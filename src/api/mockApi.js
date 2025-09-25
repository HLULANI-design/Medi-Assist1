// Enhanced Mock API for Medi-Assist Healthcare Management System
// This structure mirrors a real backend API for easy integration

// Mock patient data with realistic healthcare information
const mockPatients = [
  {
    id: 1,
    patientId: "PAT001",
    name: "Thabo Mthembu",
    age: 35,
    gender: "Male",
    email: "thabo.mthembu@email.com",
    phone: "+27821234567",
    address: "123 Sandton Drive, Johannesburg, South Africa",
    bloodGroup: "O+",
    conditions: ["Hypertension", "Diabetes Type 2"],
    lastVisit: "2025-01-15",
    nextAppointment: "2025-02-15",
    status: "Active",
    emergencyContact: {
      name: "Nomsa Mthembu",
      phone: "+27821234568",
      relation: "Wife"
    },
    insurance: {
      provider: "Discovery Health",
      policyNumber: "DH123456789"
    },
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2025-01-15T14:30:00Z"
  },
  {
    id: 2,
    patientId: "PAT002",
    name: "Lindiwe van der Merwe",
    age: 42,
    gender: "Female",
    email: "lindiwe.vandermerwe@email.com",
    phone: "+27834567890",
    address: "456 Kloof Street, Cape Town, South Africa",
    bloodGroup: "A-",
    conditions: ["Asthma", "Migraine"],
    lastVisit: "2025-01-20",
    nextAppointment: "2025-02-20",
    status: "Active",
    emergencyContact: {
      name: "Pieter van der Merwe",
      phone: "+27834567891",
      relation: "Husband"
    },
    insurance: {
      provider: "Medihelp",
      policyNumber: "MH987654321"
    },
    createdAt: "2024-08-10T09:00:00Z",
    updatedAt: "2025-01-20T11:15:00Z"
  },
  {
    id: 3,
    patientId: "PAT003",
    name: "Sipho Ndlovu",
    age: 28,
    gender: "Male",
    email: "sipho.ndlovu@email.com",
    phone: "+27845678901",
    address: "789 Marine Drive, Durban, South Africa",
    bloodGroup: "B+",
    conditions: ["Allergies"],
    lastVisit: "2025-01-10",
    nextAppointment: null,
    status: "Active",
    emergencyContact: {
      name: "Nozipho Ndlovu",
      phone: "+27845678902",
      relation: "Sister"
    },
    insurance: null,
    createdAt: "2024-12-05T16:00:00Z",
    updatedAt: "2025-01-10T13:45:00Z"
  }
];

// Mock appointment data with comprehensive details
const mockAppointments = [
  {
    id: 1,
    appointmentId: "APT001",
    patientId: 1,
    patientName: "Thabo Mthembu",
    doctorId: "DOC001",
    doctorName: "Dr. Thandiwe Mbeki",
    department: "Cardiology",
    date: "2025-02-15",
    time: "10:00 AM",
    duration: 30,
    type: "Follow-up",
    status: "Scheduled",
    reason: "Hypertension monitoring",
    notes: "Regular blood pressure check",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: 2,
    appointmentId: "APT002",
    patientId: 2,
    patientName: "Lindiwe van der Merwe",
    doctorId: "DOC002",
    doctorName: "Dr. Kgotso Motsepe",
    department: "Pulmonology",
    date: "2025-02-16",
    time: "2:00 PM",
    duration: 45,
    type: "Consultation",
    status: "Completed",
    reason: "Asthma review",
    notes: "Patient responding well to treatment",
    createdAt: "2025-01-20T09:00:00Z",
    updatedAt: "2025-02-16T14:45:00Z"
  },
  {
    id: 3,
    appointmentId: "APT003",
    patientId: 1,
    patientName: "Thabo Mthembu",
    doctorId: "DOC003",
    doctorName: "Dr. Zinhle Radebe",
    department: "Endocrinology",
    date: "2025-02-18",
    time: "11:30 AM",
    duration: 30,
    type: "Follow-up",
    status: "Cancelled",
    reason: "Diabetes consultation",
    notes: "Patient requested reschedule",
    createdAt: "2025-01-25T12:00:00Z",
    updatedAt: "2025-02-17T16:20:00Z"
  }
];

// Mock feedback data with detailed ratings
const mockFeedback = [
  {
    id: 1,
    feedbackId: "FB001",
    patientId: 1,
    patientName: "Thabo Mthembu",
    appointmentId: 1,
    doctorId: "DOC001",
    doctorName: "Dr. Thandiwe Mbeki",
    ratings: {
      overall: 5,
      waitTime: 4,
      doctorCare: 5,
      staffBehavior: 5,
      facilities: 4
    },
    comment: "Excellent service and care! Dr. Mbeki is very professional and explained everything clearly.",
    category: "Positive",
    isAnonymous: false,
    date: "2025-01-16",
    createdAt: "2025-01-16T15:30:00Z"
  },
  {
    id: 2,
    feedbackId: "FB002",
    patientId: 2,
    patientName: "Lindiwe van der Merwe",
    appointmentId: 2,
    doctorId: "DOC002",
    doctorName: "Dr. Kgotso Motsepe",
    ratings: {
      overall: 4,
      waitTime: 3,
      doctorCare: 5,
      staffBehavior: 4,
      facilities: 4
    },
    comment: "Very professional staff, slight wait time but the care was excellent.",
    category: "Positive",
    isAnonymous: false,
    date: "2025-01-21",
    createdAt: "2025-01-21T16:45:00Z"
  }
];

// Mock doctors data
const mockDoctors = [
  {
    id: "DOC001",
    name: "Dr. Thandiwe Mbeki",
    specialization: "Cardiology",
    department: "Cardiology",
    email: "t.mbeki@hospital.co.za",
    phone: "+27116543210",
    experience: 15,
    qualification: "MB ChB, MMed (Cardiology)",
    availability: {
      monday: ["09:00", "17:00"],
      tuesday: ["09:00", "17:00"],
      wednesday: ["09:00", "17:00"],
      thursday: ["09:00", "17:00"],
      friday: ["09:00", "15:00"]
    }
  },
  {
    id: "DOC002",
    name: "Dr. Kgotso Motsepe",
    specialization: "Pulmonology",
    department: "Pulmonology",
    email: "k.motsepe@hospital.co.za",
    phone: "+27214567890",
    experience: 12,
    qualification: "MB ChB, MMed (Pulmonology)",
    availability: {
      monday: ["10:00", "16:00"],
      tuesday: ["10:00", "16:00"],
      wednesday: ["10:00", "16:00"],
      thursday: ["10:00", "16:00"],
      friday: ["10:00", "14:00"]
    }
  }
];

// Mock analytics data for dashboard
const mockAnalytics = {
  overview: {
    totalPatients: mockPatients.length,
    activePatients: mockPatients.filter(p => p.status === 'Active').length,
    todayAppointments: mockAppointments.filter(apt => {
      const today = new Date().toISOString().split('T')[0];
      return apt.date === today;
    }).length,
    weeklyAppointments: 25,
    monthlyAppointments: 120,
    pendingFeedback: 3,
    averageRating: 4.5
  },
  patientStats: {
    byAge: [
      { range: '0-18', count: 5 },
      { range: '19-35', count: 15 },
      { range: '36-50', count: 25 },
      { range: '51-65', count: 20 },
      { range: '65+', count: 10 }
    ],
    byGender: [
      { gender: 'Male', count: 40 },
      { gender: 'Female', count: 35 }
    ],
    newPatients: {
      thisWeek: 8,
      lastWeek: 12,
      thisMonth: 35,
      lastMonth: 28
    }
  },
  appointmentStats: {
    byStatus: [
      { status: 'Scheduled', count: 15 },
      { status: 'Completed', count: 120 },
      { status: 'Cancelled', count: 8 },
      { status: 'No-show', count: 3 }
    ],
    byDepartment: [
      { department: 'Cardiology', count: 35 },
      { department: 'Pulmonology', count: 28 },
      { department: 'Endocrinology', count: 22 },
      { department: 'General Medicine', count: 40 }
    ]
  },
  feedbackStats: {
    averageRatings: {
      overall: 4.5,
      waitTime: 4.1,
      doctorCare: 4.8,
      staffBehavior: 4.3,
      facilities: 4.2
    },
    byCategory: [
      { category: 'Positive', count: 85 },
      { category: 'Neutral', count: 10 },
      { category: 'Negative', count: 5 }
    ]
  }
};

// Simulate network delay
const simulateDelay = (min = 300, max = 800) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Enhanced API client with backend-ready structure
export const apiClient = {
  // Patient API endpoints
  patients: {
    getAll: async (params = {}) => {
      await simulateDelay();
      let patients = [...mockPatients];
      
      // Simulate filtering
      if (params.search) {
        patients = patients.filter(p => 
          p.name.toLowerCase().includes(params.search.toLowerCase()) ||
          p.patientId.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      if (params.status) {
        patients = patients.filter(p => p.status === params.status);
      }
      
      return { 
        data: patients, 
        success: true,
        total: patients.length,
        page: params.page || 1,
        limit: params.limit || 10
      };
    },

    getById: async (id) => {
      await simulateDelay();
      const patient = mockPatients.find(p => p.id === parseInt(id));
      return { 
        data: patient, 
        success: !!patient,
        message: patient ? 'Patient found' : 'Patient not found'
      };
    },

    create: async (patientData) => {
      await simulateDelay();
      const newPatient = {
        id: mockPatients.length + 1,
        patientId: `PAT${String(mockPatients.length + 1).padStart(3, '0')}`,
        ...patientData,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockPatients.push(newPatient);
      return { data: newPatient, success: true, message: 'Patient created successfully' };
    },

    update: async (id, patientData) => {
      await simulateDelay();
      const index = mockPatients.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        mockPatients[index] = { 
          ...mockPatients[index], 
          ...patientData, 
          updatedAt: new Date().toISOString() 
        };
        return { data: mockPatients[index], success: true, message: 'Patient updated successfully' };
      }
      return { data: null, success: false, message: 'Patient not found' };
    },

    delete: async (id) => {
      await simulateDelay();
      const index = mockPatients.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        const deletedPatient = mockPatients.splice(index, 1)[0];
        return { data: deletedPatient, success: true, message: 'Patient deleted successfully' };
      }
      return { data: null, success: false, message: 'Patient not found' };
    }
  },

  // Appointment API endpoints
  appointments: {
    getAll: async (params = {}) => {
      await simulateDelay();
      let appointments = [...mockAppointments];
      
      if (params.patientId) {
        appointments = appointments.filter(apt => apt.patientId === parseInt(params.patientId));
      }
      
      if (params.date) {
        appointments = appointments.filter(apt => apt.date === params.date);
      }
      
      if (params.status) {
        appointments = appointments.filter(apt => apt.status === params.status);
      }
      
      return { 
        data: appointments, 
        success: true,
        total: appointments.length
      };
    },

    create: async (appointmentData) => {
      await simulateDelay();
      const newAppointment = {
        id: mockAppointments.length + 1,
        appointmentId: `APT${String(mockAppointments.length + 1).padStart(3, '0')}`,
        ...appointmentData,
        status: 'Scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockAppointments.push(newAppointment);
      return { data: newAppointment, success: true, message: 'Appointment scheduled successfully' };
    },

    update: async (id, appointmentData) => {
      await simulateDelay();
      const index = mockAppointments.findIndex(apt => apt.id === parseInt(id));
      if (index !== -1) {
        mockAppointments[index] = { 
          ...mockAppointments[index], 
          ...appointmentData, 
          updatedAt: new Date().toISOString() 
        };
        return { data: mockAppointments[index], success: true, message: 'Appointment updated successfully' };
      }
      return { data: null, success: false, message: 'Appointment not found' };
    }
  },

  // Feedback API endpoints
  feedback: {
    getAll: async (params = {}) => {
      await simulateDelay();
      let feedback = [...mockFeedback];
      
      if (params.patientId) {
        feedback = feedback.filter(fb => fb.patientId === parseInt(params.patientId));
      }
      
      if (params.rating) {
        feedback = feedback.filter(fb => fb.ratings.overall >= parseInt(params.rating));
      }
      
      return { 
        data: feedback, 
        success: true,
        total: feedback.length
      };
    },

    create: async (feedbackData) => {
      await simulateDelay();
      const newFeedback = {
        id: mockFeedback.length + 1,
        feedbackId: `FB${String(mockFeedback.length + 1).padStart(3, '0')}`,
        ...feedbackData,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      mockFeedback.push(newFeedback);
      return { data: newFeedback, success: true, message: 'Feedback submitted successfully' };
    }
  },

  // Doctors API endpoints
  doctors: {
    getAll: async () => {
      await simulateDelay();
      return { data: mockDoctors, success: true };
    },

    getById: async (id) => {
      await simulateDelay();
      const doctor = mockDoctors.find(d => d.id === id);
      return { data: doctor, success: !!doctor };
    }
  },

  // Analytics API endpoints
  analytics: {
    getDashboard: async () => {
      await simulateDelay();
      return { data: mockAnalytics, success: true };
    },

    getPatientStats: async () => {
      await simulateDelay();
      return { data: mockAnalytics.patientStats, success: true };
    },

    getAppointmentStats: async () => {
      await simulateDelay();
      return { data: mockAnalytics.appointmentStats, success: true };
    },

    getFeedbackStats: async () => {
      await simulateDelay();
      return { data: mockAnalytics.feedbackStats, success: true };
    }
  },

  // Authentication API endpoints
  auth: {
    login: async (credentials) => {
      await simulateDelay();
      if (credentials.email && credentials.password) {
        // Handle demo credentials
        if (credentials.email === 'demo@patient.com' && credentials.password === 'demo123') {
          return { 
            data: { 
              user: { 
                id: 'demo-patient-123', 
                email: credentials.email, 
                name: "John Smith",
                role: "patient",
                department: "Patient"
              }, 
              token: "mock-jwt-token-patient-" + Date.now(),
              refreshToken: "mock-refresh-token-patient-" + Date.now()
            }, 
            success: true,
            message: 'Patient login successful'
          };
        } else if (credentials.email === 'demo@doctor.com' && credentials.password === 'demo123') {
          return { 
            data: { 
              user: { 
                id: 'demo-doctor-123', 
                email: credentials.email, 
                name: "Dr. Sarah Johnson",
                role: "doctor",
                department: "Cardiology"
              }, 
              token: "mock-jwt-token-doctor-" + Date.now(),
              refreshToken: "mock-refresh-token-doctor-" + Date.now()
            }, 
            success: true,
            message: 'Doctor login successful'
          };
        } else {
          // General login for any other credentials
          return { 
            data: { 
              user: { 
                id: 1, 
                email: credentials.email, 
                name: "Dr. Admin",
                role: "administrator",
                department: "Administration"
              }, 
              token: "mock-jwt-token-" + Date.now(),
              refreshToken: "mock-refresh-token-" + Date.now()
            }, 
            success: true,
            message: 'Login successful'
          };
        }
      }
      return { 
        data: null, 
        success: false, 
        message: "Invalid credentials" 
      };
    },

    register: async (userData) => {
      await simulateDelay();
      return { 
        data: { 
          user: { 
            id: 2, 
            ...userData,
            role: userData.role || "staff"
          }, 
          token: "mock-jwt-token-" + Date.now(),
          refreshToken: "mock-refresh-token-" + Date.now()
        }, 
        success: true,
        message: 'Registration successful'
      };
    },

    logout: async () => {
      await simulateDelay();
      return { success: true, message: 'Logged out successfully' };
    },

    refreshToken: async (refreshToken) => {
      await simulateDelay();
      return {
        data: {
          token: "mock-jwt-token-" + Date.now(),
          refreshToken: "mock-refresh-token-" + Date.now()
        },
        success: true
      };
    }
  }
};

// Export individual mock data for testing
export { mockPatients, mockAppointments, mockFeedback, mockDoctors, mockAnalytics };