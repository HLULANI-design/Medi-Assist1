import React, { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button, Dropdown, Badge, Container } from 'react-bootstrap';

const TopNavbar = ({ user, onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Navbar expand="lg" className="bg-gradient-primary shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#" className="text-white fw-bold d-flex align-items-center">
          <i className="bi bi-hospital me-2 fs-4"></i>
          Medi-Assist
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Search Form */}
            <Form className="d-flex ms-3">
              <FormControl
                type="search"
                placeholder="Search patients, appointments..."
                className="me-2"
                aria-label="Search"
                style={{ minWidth: '300px' }}
              />
              <Button variant="outline-light">
                <i className="bi bi-search"></i>
              </Button>
            </Form>
          </Nav>
          
          <Nav className="align-items-center">
            {/* Notifications */}
            <Nav.Link href="#" className="text-white position-relative me-3">
              <i className="bi bi-bell-fill fs-5"></i>
              <Badge 
                bg="danger" 
                pill 
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: '0.7rem' }}
              >
                3
              </Badge>
            </Nav.Link>
            
            {/* User Profile Dropdown */}
            <Dropdown>
              <Dropdown.Toggle 
                as="div"
                className="d-flex align-items-center text-white text-decoration-none cursor-pointer"
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="User Profile" 
                  className="rounded-circle me-2"
                  width="32"
                  height="32"
                />
                <span className="d-none d-md-inline">
                  {user?.name || user?.email || 'User'}
                </span>
                <i className="bi bi-chevron-down ms-1"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item>
                  <i className="bi bi-person me-2"></i>
                  Profile Settings
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="bi bi-gear me-2"></i>
                  Account Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;