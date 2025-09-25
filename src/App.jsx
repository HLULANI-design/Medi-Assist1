import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import PatientSidebar from './components/PatientSidebar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Register from './pages/Register';

// Patient-side components
import PatientDashboard from './pages/PatientDashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import PatientQuestionnaire from './pages/PatientQuestionnaire';
import DoctorRating from './pages/DoctorRating';
import MedicationTracker from './pages/MedicationTracker';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('doctor'); // 'doctor' or 'patient'

  console.log('App component loaded', { currentUser, isLoading, userRole });

  // Check for existing user session on app load
  useEffect(() => {
    const token = localStorage.getItem('mediAssistToken');
    const userData = localStorage.getItem('mediAssistUser');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('mediAssistToken');
        localStorage.removeItem('mediAssistUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setUserRole(user.role || 'doctor');
    setActiveSection(user.role === 'patient' ? 'patient-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('mediAssistToken');
    localStorage.removeItem('mediAssistUser');
    setCurrentUser(null);
    setUserRole('doctor');
    setActiveSection('dashboard');
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    setUserRole(user.role || 'doctor');
    setActiveSection(user.role === 'patient' ? 'patient-dashboard' : 'dashboard');
    setShowRegister(false);
  };

  const switchRole = (newRole) => {
    setUserRole(newRole);
    setActiveSection(newRole === 'patient' ? 'patient-dashboard' : 'dashboard');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      // Doctor/Admin Dashboard Sections
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <Patients />;
      case 'appointments':
        return <Appointments />;
      case 'feedback':
        return <Feedback />;
      
      // Patient Dashboard Sections
      case 'patient-dashboard':
        return <PatientDashboard />;
      case 'book-appointment':
        return <AppointmentBooking />;
      case 'questionnaire':
        return <PatientQuestionnaire />;
      case 'rate-doctor':
        return <DoctorRating />;
      case 'medications':
        return <MedicationTracker />;
      
      default:
        return userRole === 'patient' ? <PatientDashboard /> : <Dashboard />;
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="loading-screen d-flex justify-content-center align-items-center min-vh-100 bg-primary text-white">
        <div className="text-center">
          <div className="mb-4">
            <h1 className="display-4 fw-bold">🏥 Medi-Assist</h1>
            <p className="fs-5">Healthcare Management Dashboard</p>
          </div>
          <div className="spinner-border text-light mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  // Show authentication screens if not logged in
  if (!currentUser) {
    return (
      <div className="min-vh-100">
        {showRegister ? (
          <Register 
            onRegister={handleRegister}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    );
  }

  // Main dashboard interface
  return (
    <div className="min-vh-100 d-flex flex-column">
      <TopNavbar user={currentUser} onLogout={handleLogout} />
      
      <div className="flex-grow-1 d-flex">
        {/* Role Switcher - Demo purposes */}
        <div className="position-fixed" style={{ top: '70px', right: '20px', zIndex: 1040 }}>
          <div className="d-flex gap-2 mb-2">
            <Button 
              size="sm" 
              variant={userRole === 'doctor' ? 'primary' : 'outline-primary'}
              onClick={() => switchRole('doctor')}
              className="d-flex align-items-center"
            >
              <i className="bi bi-hospital me-1"></i>
              Doctor View
              {userRole === 'doctor' && <Badge bg="light" text="dark" className="ms-2">Active</Badge>}
            </Button>
            <Button 
              size="sm" 
              variant={userRole === 'patient' ? 'success' : 'outline-success'}
              onClick={() => switchRole('patient')}
              className="d-flex align-items-center"
            >
              <i className="bi bi-person-heart me-1"></i>
              Patient View
              {userRole === 'patient' && <Badge bg="light" text="dark" className="ms-2">Active</Badge>}
            </Button>
          </div>
        </div>

        {/* Dynamic Sidebar based on role */}
        {userRole === 'patient' ? (
          <PatientSidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            onLogout={handleLogout}
          />
        ) : (
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            onLogout={handleLogout}
          />
        )}
        
        <main className="flex-grow-1 bg-light">
          {/* Breadcrumb and Welcome Header */}
          <div className="bg-white border-bottom">
            <Container fluid className="py-3">
              <Row className="align-items-center">
                <Col md={6}>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item text-muted">Medi-Assist</li>
                      <li className="breadcrumb-item active" aria-current="page">
                        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                      </li>
                    </ol>
                  </nav>
                </Col>
                <Col md={6} className="text-md-end">
                  <div className="d-flex align-items-center justify-content-end gap-3">
                    <Badge bg={userRole === 'patient' ? 'success' : 'primary'} className="px-3 py-2">
                      <i className={`bi bi-${userRole === 'patient' ? 'person-heart' : 'hospital'} me-1`}></i>
                      {userRole === 'patient' ? 'Patient Portal' : 'Doctor Dashboard'}
                    </Badge>
                    <small className="text-muted">
                      Welcome back, <strong>{currentUser.name || currentUser.email}</strong>
                    </small>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          
          {/* Main Content */}
          <Container fluid className="py-4">
            <div className="fade-in">
              {renderActiveSection()}
            </div>
          </Container>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-dark text-light py-3 mt-auto">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <p className="mb-0">&copy; 2025 Medi-Assist | Healthcare Management Dashboard</p>
            </Col>
            <Col md={6} className="text-md-end">
              <small className="text-muted">Improving patient care through technology 🚀</small>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default App;
