import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Toast, ToastContainer, Modal, Form } from 'react-bootstrap';
import { api, apiUtils } from '../api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [buttonLoading, setButtonLoading] = useState({});
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    emergencyContact: ''
  });

  // State for new appointment form
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    type: 'consultation',
    duration: '30',
    notes: ''
  });

  const [submittingForm, setSubmittingForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard analytics
      const response = await api.analytics.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(apiUtils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  // Demo functions for interactive buttons
  const handleRefreshData = () => {
    setToastMessage('🔄 Dashboard data refreshed!');
    setToastVariant('info');
    setShowToast(true);
    fetchDashboardData();
  };

  const handleQuickAction = async (action) => {
    setButtonLoading(prev => ({...prev, [action]: true}));
    
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Open appropriate modal based on action
      switch (action) {
        case 'add-patient':
          setShowAddPatientModal(true);
          setToastMessage('👤 Patient registration form opened!');
          break;
        case 'schedule':
          setShowScheduleModal(true);
          setToastMessage('📅 Appointment scheduler opened!');
          break;
        case 'reports':
          setShowReportsModal(true);
          setToastMessage('📊 Report generator opened!');
          break;
        case 'analytics':
          setShowAnalyticsModal(true);
          setToastMessage('📈 Analytics dashboard opened!');
          break;
        default:
          setToastMessage('✅ Action completed successfully!');
      }
      
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('❌ Action failed. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setButtonLoading(prev => ({...prev, [action]: false}));
    }
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({...prev, [name]: value}));
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setToastMessage(`✅ Patient "${newPatient.name}" added successfully!`);
      setToastVariant('success');
      setShowToast(true);
      
      // Reset form
      setNewPatient({
        name: '', age: '', gender: 'Male', email: '', phone: '', address: '', bloodGroup: '', emergencyContact: ''
      });
      setShowAddPatientModal(false);
      
    } catch (error) {
      setToastMessage('❌ Failed to add patient. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setSubmittingForm(false);
    }
  };

  // Appointment form handlers
  const handleAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({...prev, [name]: value}));
  };

  const handleScheduleAppointment = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setToastMessage(`✅ Appointment scheduled for ${newAppointment.patient} successfully!`);
      setToastVariant('success');
      setShowToast(true);
      
      // Reset form
      setNewAppointment({
        patient: '', doctor: '', date: '', time: '', type: 'consultation', duration: '30', notes: ''
      });
      setShowScheduleModal(false);
      
    } catch (error) {
      setToastMessage('❌ Failed to schedule appointment. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setSubmittingForm(false);
    }
  };

  // Generate report handler
  const generateReport = async (reportType) => {
    const loadingKey = `generate${reportType.charAt(0).toUpperCase() + reportType.slice(1)}Report`;
    setButtonLoading(prev => ({...prev, [loadingKey]: true}));
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const reportNames = {
        patient: 'Patient Demographics Report',
        appointment: 'Appointment Statistics Report',
        revenue: 'Revenue Analysis Report',
        department: 'Department Performance Report',
        all: 'Complete Healthcare Report Package'
      };
      
      setToastMessage(`📊 ${reportNames[reportType]} generated successfully! Check your downloads.`);
      setToastVariant('success');
      setShowToast(true);
      
    } catch (error) {
      setToastMessage('❌ Failed to generate report. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setButtonLoading(prev => ({...prev, [loadingKey]: false}));
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">Error Loading Dashboard</h6>
            <small>{error}</small>
          </div>
          <Button variant="outline-danger" size="sm" onClick={fetchDashboardData}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  const { overview, patientStats, appointmentStats, feedbackStats } = dashboardData || {};

  return (
    <Container fluid>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold text-dark mb-1 d-flex align-items-center">
            <div className="bg-primary bg-gradient rounded-3 p-2 me-3">
              <i className="bi bi-hospital text-white" style={{fontSize: '1.5rem'}}></i>
            </div>
            Dashboard Overview
          </h1>
          <p className="text-muted mb-0 ms-5 ps-3">
            <i className="bi bi-circle-fill text-success me-2" style={{fontSize: '0.5rem'}}></i>
            Welcome to Medi-Assist Management System
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" className="rounded-pill px-3 d-flex align-items-center">
            <i className="bi bi-bell me-2"></i>
            <span className="badge bg-danger rounded-pill ms-1">3</span>
          </Button>
          <Button variant="primary" size="sm" className="rounded-pill px-3 shadow-sm" onClick={fetchDashboardData}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col lg={3} md={6}>
          <Card className="h-100 border-0 shadow-sm bg-gradient position-relative overflow-hidden" 
                style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <Card.Body className="text-white position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="fw-bold mb-1">{overview?.totalPatients || '1,247'}</h3>
                  <p className="mb-2 opacity-75">Total Patients</p>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-white bg-opacity-25 rounded-pill px-2 py-1">
                      <i className="bi bi-arrow-up me-1"></i>
                      +{patientStats?.newPatients?.thisMonth || 12}% this month
                    </span>
                  </div>
                </div>
                <div className="opacity-25">
                  <i className="bi bi-people-fill" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6}>
          <Card className="h-100 border-0 shadow-sm bg-gradient position-relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            <Card.Body className="text-white position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="fw-bold mb-1">{overview?.todayAppointments || '42'}</h3>
                  <p className="mb-2 opacity-75">Today's Appointments</p>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-white bg-opacity-25 rounded-pill px-2 py-1">
                      <i className="bi bi-calendar3 me-1"></i>
                      {overview?.weeklyAppointments || 312} this week
                    </span>
                  </div>
                </div>
                <div className="opacity-25">
                  <i className="bi bi-calendar-check" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6}>
          <Card className="h-100 border-0 shadow-sm bg-gradient position-relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
            <Card.Body className="text-white position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="fw-bold mb-1">${overview?.monthlyRevenue || '43.2K'}</h3>
                  <p className="mb-2 opacity-75">Monthly Revenue</p>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-white bg-opacity-25 rounded-pill px-2 py-1">
                      <i className="bi bi-arrow-up me-1"></i>
                      +15% vs last month
                    </span>
                  </div>
                </div>
                <div className="opacity-25">
                  <i className="bi bi-currency-dollar" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="h-100 border-0 shadow-sm bg-gradient position-relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
            <Card.Body className="text-white position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="fw-bold mb-1">4.8<i className="bi bi-star-fill ms-1" style={{fontSize: '1rem'}}></i></h3>
                  <p className="mb-2 opacity-75">Average Rating</p>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-white bg-opacity-25 rounded-pill px-2 py-1">
                      <i className="bi bi-arrow-up me-1"></i>
                      +0.2 improvement
                    </span>
                  </div>
                </div>
                <div className="opacity-25">
                  <i className="bi bi-heart-fill" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        {/* Recent Activities */}
        <Col lg={8}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Activities
                </h5>
                <Button variant="outline-primary" size="sm" onClick={() => handleQuickAction('reports')}>
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <p className="mb-1">New patient Sipho Ndlovu registered</p>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content">
                    <p className="mb-1">Appointment completed for Lindiwe van der Merwe</p>
                    <small className="text-muted">4 hours ago</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-warning"></div>
                  <div className="timeline-content">
                    <p className="mb-1">Feedback received from patient Thabo Mthembu</p>
                    <small className="text-muted">6 hours ago</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <p className="mb-1">Dr. Wilson updated patient records</p>
                    <small className="text-muted">1 day ago</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-light border-0 rounded-top">
              <h5 className="mb-0 d-flex align-items-center">
                <div className="bg-primary bg-gradient rounded-2 p-1 me-2">
                  <i className="bi bi-lightning-charge text-white"></i>
                </div>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="row g-2">
                {/* Add Patient Card */}
                <div className="col-12">
                  <Card 
                    className="border-0 shadow-sm action-card position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleQuickAction('add-patient')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  >
                    <Card.Body className="p-3 text-white">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {buttonLoading['add-patient'] ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            <i className="bi bi-person-plus" style={{fontSize: '1.5rem'}}></i>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">Add New Patient</h6>
                          <small className="opacity-75">Register new patient</small>
                        </div>
                        <i className="bi bi-arrow-right opacity-50"></i>
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                {/* Schedule Appointment Card */}
                <div className="col-12">
                  <Card 
                    className="border-0 shadow-sm action-card position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleQuickAction('schedule')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  >
                    <Card.Body className="p-3 text-white">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {buttonLoading['schedule'] ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            <i className="bi bi-calendar-plus" style={{fontSize: '1.5rem'}}></i>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">Schedule Appointment</h6>
                          <small className="opacity-75">Book new appointment</small>
                        </div>
                        <i className="bi bi-arrow-right opacity-50"></i>
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                {/* Generate Reports Card */}
                <div className="col-12">
                  <Card 
                    className="border-0 shadow-sm action-card position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleQuickAction('reports')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  >
                    <Card.Body className="p-3 text-white">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {buttonLoading['reports'] ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            <i className="bi bi-file-earmark-bar-graph" style={{fontSize: '1.5rem'}}></i>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">Generate Reports</h6>
                          <small className="opacity-75">Analytics & insights</small>
                        </div>
                        <i className="bi bi-arrow-right opacity-50"></i>
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                {/* View Analytics Card */}
                <div className="col-12">
                  <Card 
                    className="border-0 shadow-sm action-card position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleQuickAction('analytics')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  >
                    <Card.Body className="p-3 text-white">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {buttonLoading['analytics'] ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            <i className="bi bi-graph-up-arrow" style={{fontSize: '1.5rem'}}></i>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">View Analytics</h6>
                          <small className="opacity-75">Dashboard insights</small>
                        </div>
                        <i className="bi bi-arrow-right opacity-50"></i>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Patient Modal */}
      <Modal show={showAddPatientModal} onHide={() => setShowAddPatientModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-plus me-2"></i>
            Add New Patient
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddPatient}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newPatient.name}
                    onChange={handlePatientInputChange}
                    required
                    placeholder="Enter patient's full name"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Age *</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={newPatient.age}
                    onChange={handlePatientInputChange}
                    required
                    min="0"
                    max="120"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={newPatient.gender}
                    onChange={handlePatientInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newPatient.email}
                    onChange={handlePatientInputChange}
                    placeholder="patient@email.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={newPatient.phone}
                    onChange={handlePatientInputChange}
                    required
                    placeholder="(555) 123-4567"
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={newPatient.address}
                    onChange={handlePatientInputChange}
                    placeholder="Street address, city, state"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Select
                    name="bloodGroup"
                    value={newPatient.bloodGroup}
                    onChange={handlePatientInputChange}
                  >
                    <option value="">Select...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Emergency Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContact"
                    value={newPatient.emergencyContact}
                    onChange={handlePatientInputChange}
                    placeholder="Name and phone number"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddPatientModal(false)} disabled={submittingForm}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingForm}>
              {submittingForm ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Adding Patient...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>
                  Add Patient
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Schedule Appointment Modal */}
      <Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-plus me-2"></i>
            Schedule New Appointment
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleScheduleAppointment}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-person-check me-2 text-success"></i>
                    Select Patient *
                  </Form.Label>
                  <Form.Select
                    name="patient"
                    value={newAppointment.patient}
                    onChange={handleAppointmentInputChange}
                    required
                  >
                    <option value="">Choose patient...</option>
                    <option value="thabo-mthembu">Thabo Mthembu - #P001</option>
                    <option value="lindiwe-vandermerwe">Lindiwe van der Merwe - #P002</option>
                    <option value="sipho-ndlovu">Sipho Ndlovu - #P003</option>
                    <option value="nomfundo-dlamini">Nomfundo Dlamini - #P004</option>
                    <option value="johan-pretorius">Johan Pretorius - #P005</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-person-badge me-2 text-info"></i>
                    Select Doctor *
                  </Form.Label>
                  <Form.Select
                    name="doctor"
                    value={newAppointment.doctor}
                    onChange={handleAppointmentInputChange}
                    required
                  >
                    <option value="">Choose doctor...</option>
                    <option value="dr-smith">Dr. Smith - Cardiology</option>
                    <option value="dr-johnson">Dr. Johnson - General Medicine</option>
                    <option value="dr-williams">Dr. Williams - Pediatrics</option>
                    <option value="dr-davis">Dr. Davis - Orthopedics</option>
                    <option value="dr-miller">Dr. Miller - Dermatology</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                    Appointment Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newAppointment.date}
                    onChange={handleAppointmentInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-clock me-2 text-warning"></i>
                    Time Slot *
                  </Form.Label>
                  <Form.Select
                    name="time"
                    value={newAppointment.time}
                    onChange={handleAppointmentInputChange}
                    required
                  >
                    <option value="">Select time...</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="09:30">09:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="16:30">04:30 PM</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-clipboard-pulse me-2 text-secondary"></i>
                    Appointment Type
                  </Form.Label>
                  <Form.Select
                    name="type"
                    value={newAppointment.type}
                    onChange={handleAppointmentInputChange}
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="checkup">Regular Checkup</option>
                    <option value="emergency">Emergency</option>
                    <option value="procedure">Procedure</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-hourglass me-2 text-info"></i>
                    Duration (minutes)
                  </Form.Label>
                  <Form.Select
                    name="duration"
                    value={newAppointment.duration}
                    onChange={handleAppointmentInputChange}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-chat-text me-2 text-secondary"></i>
                    Notes/Reason for Visit
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={newAppointment.notes}
                    onChange={handleAppointmentInputChange}
                    placeholder="Brief description of the reason for visit..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowScheduleModal(false)} disabled={submittingForm}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingForm}>
              {submittingForm ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <i className="bi bi-calendar-plus me-2"></i>
                  Schedule Appointment
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Generate Reports Modal */}
      <Modal show={showReportsModal} onHide={() => setShowReportsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-text me-2"></i>
            Generate Reports
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-4">
            <div className="col-md-6">
              <Card className="h-100 shadow-sm" style={{cursor: 'pointer'}} 
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                <Card.Body className="text-center">
                  <i className="bi bi-people display-4 text-primary mb-3"></i>
                  <h5>Patient Reports</h5>
                  <p className="text-muted">Generate comprehensive patient statistics and demographics</p>
                  <Button 
                    variant="outline-primary" 
                    className="w-100"
                    onClick={() => generateReport('patient')}
                    disabled={buttonLoading.generatePatientReport}
                  >
                    {buttonLoading.generatePatientReport ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Generate Patient Report
                      </>
                    )}
                  </Button>
                  <small className="text-muted d-block mt-2">Last generated: 2 hours ago</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="h-100 shadow-sm" style={{cursor: 'pointer'}}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                <Card.Body className="text-center">
                  <i className="bi bi-calendar-check display-4 text-success mb-3"></i>
                  <h5>Appointment Reports</h5>
                  <p className="text-muted">Detailed appointment history and statistics</p>
                  <Button 
                    variant="outline-success" 
                    className="w-100"
                    onClick={() => generateReport('appointment')}
                    disabled={buttonLoading.generateAppointmentReport}
                  >
                    {buttonLoading.generateAppointmentReport ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Generate Appointment Report
                      </>
                    )}
                  </Button>
                  <small className="text-muted d-block mt-2">Last generated: 1 day ago</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="h-100 shadow-sm" style={{cursor: 'pointer'}}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                <Card.Body className="text-center">
                  <i className="bi bi-graph-up display-4 text-info mb-3"></i>
                  <h5>Revenue Reports</h5>
                  <p className="text-muted">Financial reports and revenue analysis</p>
                  <Button 
                    variant="outline-info" 
                    className="w-100"
                    onClick={() => generateReport('revenue')}
                    disabled={buttonLoading.generateRevenueReport}
                  >
                    {buttonLoading.generateRevenueReport ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Generate Revenue Report
                      </>
                    )}
                  </Button>
                  <small className="text-muted d-block mt-2">Last generated: 3 hours ago</small>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="h-100 shadow-sm" style={{cursor: 'pointer'}}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                <Card.Body className="text-center">
                  <i className="bi bi-clipboard-data display-4 text-warning mb-3"></i>
                  <h5>Department Reports</h5>
                  <p className="text-muted">Department-wise performance metrics</p>
                  <Button 
                    variant="outline-warning" 
                    className="w-100"
                    onClick={() => generateReport('department')}
                    disabled={buttonLoading.generateDepartmentReport}
                  >
                    {buttonLoading.generateDepartmentReport ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Generate Department Report
                      </>
                    )}
                  </Button>
                  <small className="text-muted d-block mt-2">Last generated: 5 hours ago</small>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="mt-4 p-3 bg-light rounded">
            <h6><i className="bi bi-info-circle me-2 text-info"></i>Report Options</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Select size="sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                </Form.Select>
                <small className="text-muted">Time Period</small>
              </div>
              <div className="col-md-4">
                <Form.Select size="sm">
                  <option>PDF Format</option>
                  <option>Excel Format</option>
                  <option>CSV Format</option>
                </Form.Select>
                <small className="text-muted">File Format</small>
              </div>
              <div className="col-md-4">
                <Form.Check 
                  type="checkbox" 
                  label="Email report" 
                  size="sm"
                />
                <small className="text-muted">Send to email</small>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => generateReport('all')}>
            <i className="bi bi-download me-2"></i>
            Generate All Reports
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Analytics Modal */}
      <Modal show={showAnalyticsModal} onHide={() => setShowAnalyticsModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-graph-up me-2"></i>
            Analytics Dashboard
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-4">
            <div className="col-md-3">
              <Card className="bg-primary text-white shadow-sm">
                <Card.Body className="text-center">
                  <i className="bi bi-people display-4 mb-2"></i>
                  <h4>1,247</h4>
                  <p className="mb-0">Total Patients</p>
                  <small>↗️ +12% this month</small>
                  <div className="progress mt-2" style={{height: '4px'}}>
                    <div className="progress-bar bg-light" style={{width: '75%'}}></div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="bg-success text-white shadow-sm">
                <Card.Body className="text-center">
                  <i className="bi bi-calendar-check display-4 mb-2"></i>
                  <h4>342</h4>
                  <p className="mb-0">Appointments Today</p>
                  <small>↗️ +8% vs yesterday</small>
                  <div className="progress mt-2" style={{height: '4px'}}>
                    <div className="progress-bar bg-light" style={{width: '85%'}}></div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="bg-info text-white shadow-sm">
                <Card.Body className="text-center">
                  <i className="bi bi-currency-dollar display-4 mb-2"></i>
                  <h4>$43.2K</h4>
                  <p className="mb-0">Revenue This Week</p>
                  <small>↗️ +15% vs last week</small>
                  <div className="progress mt-2" style={{height: '4px'}}>
                    <div className="progress-bar bg-light" style={{width: '60%'}}></div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="bg-warning text-white shadow-sm">
                <Card.Body className="text-center">
                  <i className="bi bi-star display-4 mb-2"></i>
                  <h4>4.8</h4>
                  <p className="mb-0">Avg Rating</p>
                  <small>📈 +0.2 improvement</small>
                  <div className="progress mt-2" style={{height: '4px'}}>
                    <div className="progress-bar bg-light" style={{width: '95%'}}></div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-8">
              <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-bar-chart me-2"></i>
                    Patient Flow Analytics
                  </h5>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <i className="bi bi-calendar3 me-1"></i>
                      This Week
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-download me-1"></i>
                      Export
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <strong className="text-primary">Emergency: 23%</strong>
                        <div className="progress mt-2">
                          <div className="progress-bar bg-primary" style={{width: '23%'}}></div>
                        </div>
                        <small className="text-muted">78 patients</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <strong className="text-success">Scheduled: 67%</strong>
                        <div className="progress mt-2">
                          <div className="progress-bar bg-success" style={{width: '67%'}}></div>
                        </div>
                        <small className="text-muted">229 patients</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border rounded p-3">
                        <strong className="text-warning">Walk-in: 10%</strong>
                        <div className="progress mt-2">
                          <div className="progress-bar bg-warning" style={{width: '10%'}}></div>
                        </div>
                        <small className="text-muted">35 patients</small>
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-3">
                    <i className="bi bi-graph-up display-3 text-muted mb-3"></i>
                    <h5>Interactive Chart Area</h5>
                    <p className="text-muted">Real-time patient flow visualization would appear here</p>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="shadow-sm h-100">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-pie-chart me-2"></i>
                    Department Load
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Cardiology</small>
                      <small>85%</small>
                    </div>
                    <div className="progress mb-3" style={{height: '8px'}}>
                      <div className="progress-bar bg-danger" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>General Medicine</small>
                      <small>72%</small>
                    </div>
                    <div className="progress mb-3" style={{height: '8px'}}>
                      <div className="progress-bar bg-warning" style={{width: '72%'}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Pediatrics</small>
                      <small>56%</small>
                    </div>
                    <div className="progress mb-3" style={{height: '8px'}}>
                      <div className="progress-bar bg-success" style={{width: '56%'}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Orthopedics</small>
                      <small>43%</small>
                    </div>
                    <div className="progress mb-3" style={{height: '8px'}}>
                      <div className="progress-bar bg-info" style={{width: '43%'}}></div>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <Button variant="outline-primary" size="sm">
                      <i className="bi bi-eye me-1"></i>
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalyticsModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <i className="bi bi-download me-2"></i>
            Export Analytics
          </Button>
          <Button variant="info" className="ms-2">
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh Data
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : 'Info'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Dashboard;