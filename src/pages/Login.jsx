import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { api, apiUtils } from '../api';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.auth.login(formData);
      
      if (response.success) {
        localStorage.setItem('mediAssistToken', response.data.token);
        localStorage.setItem('mediAssistUser', JSON.stringify(response.data.user));
        
        if (onLogin) {
          onLogin(response.data.user);
        }
      } else {
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100">
        <div className="position-absolute rounded-circle bg-white opacity-10" 
             style={{ 
               width: '200px', height: '200px', top: '10%', right: '15%',
               animation: 'float 6s ease-in-out infinite'
             }}></div>
        <div className="position-absolute rounded-circle bg-white opacity-10" 
             style={{ 
               width: '150px', height: '150px', bottom: '20%', left: '10%',
               animation: 'float 8s ease-in-out infinite reverse'
             }}></div>
      </div>

      <Container className="position-relative" style={{ zIndex: 2 }}>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="shadow-lg border-0" style={{ 
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}>
              <Card.Body className="p-5">
                {/* Logo and Header */}
                <div className="text-center mb-5">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary shadow-lg mb-4" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-hospital fs-1 text-white"></i>
                  </div>
                  <h1 className="h2 fw-bold text-dark mb-2">Welcome Back</h1>
                  <p className="text-muted mb-0">Sign in to your Medi-Assist account</p>
                </div>

                {/* Demo Credentials */}
                <div className="alert alert-info border-0 rounded-4 mb-4" style={{ 
                  background: 'linear-gradient(45deg, #e3f2fd, #f3e5f5)' 
                }}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-key-fill text-primary me-2"></i>
                    <strong className="text-primary">Demo Credentials</strong>
                  </div>
                  <div className="small">
                    <div><strong>Email:</strong> demo@mediassist.com</div>
                    <div><strong>Password:</strong> demo123</div>
                  </div>
                </div>

                {error && (
                  <Alert variant="danger" className="border-0 rounded-4 mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">Email Address</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        size="lg"
                        className="border-0 shadow-sm rounded-4 ps-5"
                        style={{ backgroundColor: '#f8f9ff' }}
                      />
                      <i className="bi bi-envelope-fill position-absolute text-muted" 
                         style={{ left: '18px', top: '50%', transform: 'translateY(-50%)' }}></i>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                        size="lg"
                        className="border-0 shadow-sm rounded-4 ps-5"
                        style={{ backgroundColor: '#f8f9ff' }}
                      />
                      <i className="bi bi-lock-fill position-absolute text-muted" 
                         style={{ left: '18px', top: '50%', transform: 'translateY(-50%)' }}></i>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 fw-semibold border-0 rounded-4 mb-4"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">Don't have an account? </span>
                    <Button
                      variant="link"
                      className="text-decoration-none fw-semibold p-0"
                      onClick={onSwitchToRegister}
                      style={{ color: '#667eea' }}
                    >
                      Register here
                    </Button>
                  </div>
                </Form>

                {/* Demo Credentials */}
                <div className="text-center mt-4 p-3 bg-light rounded-4">
                  <small className="text-muted fw-bold">🎯 Demo Credentials:</small><br/>
                  <small className="text-primary">
                    <strong>Doctor:</strong> demo@doctor.com / demo123<br/>
                    <strong>Patient:</strong> demo@patient.com / demo123
                  </small>
                </div>
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
        
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25) !important;
          border-color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default Login;