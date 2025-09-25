import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { api, apiUtils } from '../api';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'doctor',
    phone: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await api.auth.register(registrationData);
      
      if (response.success) {
        localStorage.setItem('mediAssistToken', response.data.token);
        localStorage.setItem('mediAssistUser', JSON.stringify(response.data.user));
        
        if (onRegister) {
          onRegister(response.data.user);
        }
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100">
        <div className="position-absolute rounded-circle bg-white opacity-10" 
             style={{ 
               width: '180px', height: '180px', top: '15%', left: '10%',
               animation: 'float 7s ease-in-out infinite'
             }}></div>
        <div className="position-absolute rounded-circle bg-white opacity-10" 
             style={{ 
               width: '120px', height: '120px', bottom: '25%', right: '20%',
               animation: 'float 9s ease-in-out infinite reverse'
             }}></div>
      </div>

      <Container className="position-relative py-5" style={{ zIndex: 2 }}>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0" style={{ 
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}>
              <Card.Body className="p-5">
                {/* Logo and Header */}
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success shadow-lg mb-3" 
                       style={{ width: '70px', height: '70px' }}>
                    <i className="bi bi-person-plus fs-1 text-white"></i>
                  </div>
                  <h1 className="h2 fw-bold text-dark mb-2">Join Medi-Assist</h1>
                  <p className="text-muted mb-0">Create your healthcare account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="border-0 rounded-4 mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">Full Name</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Dr. John Smith"
                            required
                            className="border-0 shadow-sm rounded-3 ps-4"
                            style={{ backgroundColor: '#f8f9ff' }}
                          />
                          <i className="bi bi-person-fill position-absolute text-muted" 
                             style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">Phone Number</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            className="border-0 shadow-sm rounded-3 ps-4"
                            style={{ backgroundColor: '#f8f9ff' }}
                          />
                          <i className="bi bi-telephone-fill position-absolute text-muted" 
                             style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark">Email Address</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="doctor@hospital.com"
                        required
                        className="border-0 shadow-sm rounded-3 ps-4"
                        style={{ backgroundColor: '#f8f9ff' }}
                      />
                      <i className="bi bi-envelope-fill position-absolute text-muted" 
                         style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
                    </div>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">Role</Form.Label>
                        <div className="position-relative">
                          <Form.Select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            className="border-0 shadow-sm rounded-3 ps-4"
                            style={{ backgroundColor: '#f8f9ff' }}
                          >
                            <option value="doctor">Doctor</option>
                            <option value="nurse">Nurse</option>
                            <option value="admin">Administrator</option>
                            <option value="patient">Patient</option>
                          </Form.Select>
                          <i className="bi bi-person-badge-fill position-absolute text-muted" 
                             style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}></i>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">Specialization</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            placeholder="Cardiology, Surgery, etc."
                            className="border-0 shadow-sm rounded-3 ps-4"
                            style={{ backgroundColor: '#f8f9ff' }}
                          />
                          <i className="bi bi-clipboard2-pulse-fill position-absolute text-muted" 
                             style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create password"
                            required
                            className="border-0 shadow-sm rounded-3 ps-4"
                            style={{ backgroundColor: '#f8f9ff' }}
                          />
                          <i className="bi bi-lock-fill position-absolute text-muted" 
                             style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold text-dark">Confirm Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm password"
                            required
                            className="border-0 shadow-sm rounded-3 ps-4"
                            style={{ backgroundColor: '#f8f9ff' }}
                          />
                          <i className="bi bi-shield-check-fill position-absolute text-muted" 
                             style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 fw-semibold border-0 rounded-4 mb-4"
                    style={{ 
                      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">Already have an account? </span>
                    <Button
                      variant="link"
                      className="text-decoration-none fw-semibold p-0"
                      onClick={onSwitchToLogin}
                      style={{ color: '#764ba2' }}
                    >
                      Sign in here
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(118, 75, 162, 0.25) !important;
          border-color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default Register;