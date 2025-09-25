import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';

const PatientSidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const patientMenuItems = [
    { id: 'patient-dashboard', label: 'Overview', icon: 'bi-grid-1x2-fill' },
    { id: 'book-appointment', label: 'Book Appointment', icon: 'bi-calendar-plus-fill' },
    { id: 'questionnaire', label: 'Pre-Visit Forms', icon: 'bi-clipboard-check-fill' },
    { id: 'medications', label: 'My Medications', icon: 'bi-capsule-pill' },
    { id: 'rate-doctor', label: 'Rate & Review', icon: 'bi-star-fill' }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="sidebar bg-light border-end shadow-sm d-flex flex-column" style={{ width: isCollapsed ? '80px' : '280px', minHeight: '100vh' }}>
      <div className="p-3 border-bottom bg-white">
        <div className="d-flex align-items-center justify-content-between">
          {!isCollapsed && (
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-gradient rounded-3 p-2 me-2">
                <i className="bi bi-heart-pulse text-white"></i>
              </div>
              <div>
                <h6 className="mb-0 fw-bold">Patient Portal</h6>
                <small className="text-muted">Medi-Assist</small>
              </div>
            </div>
          )}
          <Button variant="outline-primary" size="sm" onClick={toggleSidebar}>
            <i className={isCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'}></i>
          </Button>
        </div>
      </div>

      <div className="flex-grow-1 p-3">
        <Nav className="flex-column gap-2">
          {patientMenuItems.map((item) => (
            <Nav.Link
              key={item.id}
              className={`d-flex align-items-center p-3 rounded-3 text-decoration-none ${
                activeSection === item.id ? 'bg-primary text-white' : 'text-dark'
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <i className={`bi ${item.icon} me-3`}></i>
              {!isCollapsed && <span>{item.label}</span>}
            </Nav.Link>
          ))}
        </Nav>
      </div>

      <div className="p-3 border-top bg-white">
        <Button variant="outline-danger" className="w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          {!isCollapsed && 'Logout'}
        </Button>
      </div>
    </div>
  );
};

export default PatientSidebar;
