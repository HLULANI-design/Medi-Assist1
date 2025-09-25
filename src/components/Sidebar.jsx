import React, { useState } from 'react';
import { Nav, Button, Collapse } from 'react-bootstrap';

const Sidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'patients', label: 'Patients', icon: 'bi-people-fill', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'appointments', label: 'Appointments', icon: 'bi-calendar-check-fill', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { id: 'feedback', label: 'Feedback', icon: 'bi-chat-heart-fill', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div 
      className={`sidebar text-light ${isCollapsed ? 'collapsed' : ''}`} 
      style={{ 
        minWidth: isCollapsed ? '70px' : '280px', 
        transition: 'all 0.3s ease',
        background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        borderRight: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-bottom" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
        <div className="d-flex justify-content-between align-items-center">
          <Collapse in={!isCollapsed} dimension="width">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-gradient rounded-3 p-2 me-2">
                <i className="bi bi-hospital text-white" style={{fontSize: '1.2rem'}}></i>
              </div>
              <div>
                <h6 className="mb-0 text-white fw-bold">Medi-Assist</h6>
                <small className="text-light opacity-75">Healthcare Portal</small>
              </div>
            </div>
          </Collapse>
          <Button 
            variant="outline-light" 
            size="sm"
            onClick={toggleSidebar}
            className="rounded-2 border-0"
            style={{opacity: 0.7}}
          >
            <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </Button>
        </div>
      </div>
      
      {/* Sidebar Menu */}
      <Nav className="flex-column p-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-link text-light mb-2 rounded-3 position-relative overflow-hidden ${
              activeSection === item.id ? 'active-menu-item' : ''
            }`}
            onClick={() => setActiveSection(item.id)}
            style={{ 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: activeSection === item.id ? item.color : 'transparent',
              border: activeSection === item.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              transform: activeSection === item.id ? 'translateX(5px)' : 'translateX(0px)'
            }}
            onMouseEnter={(e) => {
              if (activeSection !== item.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateX(3px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== item.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0px)';
              }
            }}
          >
            <div className="d-flex align-items-center p-2">
              <div className="me-3 d-flex align-items-center justify-content-center" style={{minWidth: '24px'}}>
                <i className={`${item.icon} fs-5`}></i>
              </div>
              <Collapse in={!isCollapsed} dimension="width">
                <div className="d-flex flex-column">
                  <span className="fw-semibold">{item.label}</span>
                  <small className="opacity-75" style={{fontSize: '0.75rem'}}>
                    {item.id === 'dashboard' && 'Overview & stats'}
                    {item.id === 'patients' && 'Manage patients'}
                    {item.id === 'appointments' && 'Schedule & view'}
                    {item.id === 'feedback' && 'Reviews & ratings'}
                  </small>
                </div>
              </Collapse>
            </div>
            {activeSection === item.id && (
              <div 
                className="position-absolute top-0 end-0 h-100 rounded-end"
                style={{
                  width: '4px',
                  background: 'rgba(255,255,255,0.3)'
                }}
              />
            )}
          </div>
        ))}
      </Nav>
      
      {/* Sidebar Footer */}
      <div className="mt-auto p-3" style={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
        <div
          className="nav-link text-danger mb-0 rounded-3"
          onClick={handleLogout}
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.3s ease',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)';
            e.currentTarget.style.transform = 'translateX(3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateX(0px)';
          }}
        >
          <div className="d-flex align-items-center p-2">
            <div className="me-3 d-flex align-items-center justify-content-center" style={{minWidth: '24px'}}>
              <i className="bi bi-box-arrow-right fs-5"></i>
            </div>
            <Collapse in={!isCollapsed} dimension="width">
              <div className="d-flex flex-column">
                <span className="fw-semibold">Logout</span>
                <small className="opacity-75" style={{fontSize: '0.75rem'}}>Sign out safely</small>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;