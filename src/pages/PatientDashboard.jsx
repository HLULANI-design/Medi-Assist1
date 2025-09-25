import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, ProgressBar, Tabs, Tab, Toast, ToastContainer, Modal } from 'react-bootstrap';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [refreshing, setRefreshing] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({});
  const [statsUpdated, setStatsUpdated] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientData, setPatientData] = useState({
    name: 'John Smith',
    age: 32,
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
      relation: 'Spouse'
    }
  });

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2025-09-26',
      time: '10:30 AM',
      status: 'confirmed',
      type: 'Follow-up',
      questionnaire_completed: false
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Medicine',
      date: '2025-10-05',
      time: '2:15 PM',
      status: 'pending',
      type: 'Consultation',
      questionnaire_completed: true
    }
  ]);

  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      timeSlots: ['08:00'],
      startDate: '2025-09-01',
      endDate: '2025-12-01',
      adherence: 85,
      lastTaken: '2025-09-24 08:15',
      nextDose: '2025-09-25 08:00'
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timeSlots: ['08:00', '20:00'],
      startDate: '2025-08-15',
      endDate: '2025-11-15',
      adherence: 92,
      lastTaken: '2025-09-24 20:05',
      nextDose: '2025-09-25 08:00'
    }
  ]);

  // Interactive demo functions
  const handleBookAppointment = () => {
    setButtonLoading(prev => ({ ...prev, bookAppointment: true }));
    setToastMessage('🎯 Booking appointment...');
    setToastVariant('info');
    setShowToast(true);
    
    // Simulate adding a new appointment with immediate visual feedback
    setTimeout(() => {
      const newAppointment = {
        id: Date.now(),
        doctor: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        date: '2025-10-10',
        time: '3:30 PM',
        status: 'pending',
        type: 'Consultation',
        questionnaire_completed: false
      };
      setAppointments(prev => [newAppointment, ...prev]);
      setStatsUpdated(true);
      setButtonLoading(prev => ({ ...prev, bookAppointment: false }));
      setToastMessage('✅ Appointment booked successfully! Dr. Emily Rodriguez on Oct 10, 3:30 PM');
      setToastVariant('success');
      setShowToast(true);
      
      // Flash the stats cards
      setTimeout(() => setStatsUpdated(false), 2000);
    }, 1000);
  };

  const handleTakeMedication = (medId) => {
    setButtonLoading(prev => ({ ...prev, [`med_${medId}`]: true }));
    
    setTimeout(() => {
      setMedications(prev => prev.map(med => 
        med.id === medId 
          ? { 
              ...med, 
              lastTaken: new Date().toISOString(), 
              adherence: Math.min(100, med.adherence + 3),
              pillsTaken: med.pillsTaken + 1,
              pillsRemaining: med.pillsRemaining - 1
            }
          : med
      ));
      setButtonLoading(prev => ({ ...prev, [`med_${medId}`]: false }));
      setStatsUpdated(true);
      setToastMessage('💊 Medication taken! Adherence updated.');
      setToastVariant('success');
      setShowToast(true);
      
      setTimeout(() => setStatsUpdated(false), 2000);
    }, 800);
  };

  const handleRefreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setToastMessage('🔄 Health data refreshed!');
      setToastVariant('info');
      setShowToast(true);
    }, 1000);
  };

  const handleCompleteForm = async (appointmentId) => {
    // Start loading state for this specific appointment
    setButtonLoading(prev => ({...prev, [`form-${appointmentId}`]: true}));
    
    try {
      // Simulate form opening delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update appointment status
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, questionnaire_completed: true }
          : apt
      ));
      
      setToastMessage('📋 Pre-visit questionnaire completed successfully! Your doctor has been notified.');
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('❌ Failed to complete questionnaire. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setButtonLoading(prev => ({...prev, [`form-${appointmentId}`]: false}));
    }
  };

  // Quick Action handlers
  const handleEmergencyContact = async () => {
    setButtonLoading(prev => ({...prev, emergency: true}));
    await new Promise(resolve => setTimeout(resolve, 2000));
    setToastMessage('🚨 Emergency services contacted! Help is on the way.');
    setToastVariant('danger');
    setShowToast(true);
    setButtonLoading(prev => ({...prev, emergency: false}));
  };

  const handleCallClinic = async () => {
    setButtonLoading(prev => ({...prev, callClinic: true}));
    await new Promise(resolve => setTimeout(resolve, 1500));
    setToastMessage('📞 Clinic called! You will receive a callback within 15 minutes.');
    setToastVariant('info');
    setShowToast(true);
    setButtonLoading(prev => ({...prev, callClinic: false}));
  };

  const handleHealthTip = () => {
    const tips = [
      '💧 Remember to drink at least 8 glasses of water today!',
      '🚶‍♀️ Take a 10-minute walk to boost your energy levels.',
      '🧘‍♂️ Practice deep breathing for 5 minutes to reduce stress.',
      '🥗 Include colorful vegetables in your next meal for better nutrition.',
      '😴 Aim for 7-8 hours of quality sleep tonight.',
      '🧴 Don\'t forget to apply sunscreen if going outdoors!'
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setToastMessage(randomTip);
    setToastVariant('success');
    setShowToast(true);
  };

  const handleAddMedication = () => {
    const newMedication = {
      id: Date.now(),
      name: 'Vitamin B12',
      dosage: '1000mcg',
      frequency: 'Once daily',
      timeSlots: ['09:00'],
      startDate: '2025-09-25',
      endDate: '2025-12-25',
      adherence: 100,
      lastTaken: null,
      nextDose: '2025-09-25 09:00'
    };
    setMedications(prev => [...prev, newMedication]);
    setToastMessage('💊 New medication added successfully!');
    setToastVariant('success');
    setShowToast(true);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
    setToastMessage(`📋 Opening details for ${appointment.doctor}`);
    setToastVariant('info');
    setShowToast(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return 'success';
    if (adherence >= 75) return 'warning';
    return 'danger';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold text-dark mb-1 d-flex align-items-center">
                <div className="bg-primary bg-gradient rounded-3 p-2 me-3">
                  <i className="bi bi-heart-pulse text-white" style={{fontSize: '1.5rem'}}></i>
                </div>
                Welcome back, {patientData.name}!
              </h1>
              <p className="text-muted mb-0 ms-5 ps-3">
                <i className="bi bi-circle-fill text-success me-2" style={{fontSize: '0.5rem'}}></i>
                Manage your health journey with Medi-Assist
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="rounded-pill px-3 d-flex align-items-center"
                onClick={handleEmergencyContact}
                disabled={buttonLoading.emergency}
              >
                <i className="bi bi-telephone-fill me-2"></i>
                Emergency
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-pill px-3 shadow-sm" 
                onClick={handleBookAppointment}
                disabled={buttonLoading.bookAppointment}
              >
                {buttonLoading.bookAppointment ? (
                  <>
                    <i className="bi bi-arrow-clockwise me-2 spinning"></i>
                    Booking...
                  </>
                ) : (
                  <>
                    <i className="bi bi-calendar-plus me-2"></i>
                    Book Appointment
                  </>
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Stats Cards */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className={`border-0 shadow-sm position-relative overflow-hidden ${statsUpdated ? 'border border-3 border-warning' : ''}`}
                style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <Card.Body className="text-white position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="fw-bold mb-1">{appointments.length}</h3>
                  <p className="mb-2 opacity-75">Upcoming Appointments</p>
                  {statsUpdated && (
                    <span className="badge bg-white bg-opacity-25 rounded-pill px-2 py-1">
                      <i className="bi bi-star-fill me-1"></i>
                      Updated!
                    </span>
                  )}
                </div>
                <div className="opacity-25">
                  <i className="bi bi-calendar-check" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`border-0 shadow-sm position-relative overflow-hidden ${statsUpdated ? 'border border-3 border-warning' : ''}`}
                style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
            <Card.Body className="text-white position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="fw-bold mb-1">{medications.length}</h3>
                  <p className="mb-2 opacity-75">Active Medications</p>
                  {statsUpdated && (
                    <span className="badge bg-white bg-opacity-25 rounded-pill px-2 py-1">
                      <i className="bi bi-star-fill me-1"></i>
                      Updated!
                    </span>
                  )}
                </div>
                <div className="opacity-25">
                  <i className="bi bi-capsule" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm position-relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
            <Card.Body className="text-white position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="fw-bold mb-1">{appointments.filter(apt => !apt.questionnaire_completed).length}</h3>
                  <p className="mb-2 opacity-75">Pending Questionnaires</p>
                  <span className="badge bg-white bg-opacity-25 rounded-pill px-2 py-1">
                    <i className="bi bi-clock me-1"></i>
                    Action needed
                  </span>
                </div>
                <div className="opacity-25">
                  <i className="bi bi-clipboard-check" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm position-relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            <Card.Body className="text-white position-relative">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="fw-bold mb-1">98%</h3>
                  <p className="mb-2 opacity-75">Medication Adherence</p>
                  <span className="badge bg-white bg-opacity-25 rounded-pill px-2 py-1">
                    <i className="bi bi-check-circle me-1"></i>
                    Excellent
                  </span>
                </div>
                <div className="opacity-25">
                  <i className="bi bi-heart-pulse" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Section */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-0 rounded-top">
              <h5 className="mb-0 d-flex align-items-center">
                <div className="bg-primary bg-gradient rounded-2 p-1 me-2">
                  <i className="bi bi-lightning-charge text-white"></i>
                </div>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                <Col md={3}>
                  <Card 
                    className="border-0 shadow-sm action-card position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #ff416c 0%, #ff4757 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleEmergencyContact}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  >
                    <Card.Body className="p-3 text-white text-center">
                      {buttonLoading.emergency ? (
                        <div className="spinner-border mb-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <i className="bi bi-telephone-x mb-2" style={{fontSize: '2rem'}}></i>
                      )}
                      <h6 className="fw-bold mb-1">Emergency</h6>
                      <small className="opacity-75">Contact emergency services</small>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3}>
                  <Card 
                    className="border-0 shadow-sm action-card position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleCallClinic}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  >
                    <Card.Body className="p-3 text-white text-center">
                      {buttonLoading.callClinic ? (
                        <div className="spinner-border mb-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <i className="bi bi-telephone mb-2" style={{fontSize: '2rem'}}></i>
                      )}
                      <h6 className="fw-bold mb-1">Call Clinic</h6>
                      <small className="opacity-75">Speak with clinic staff</small>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3}>
                  <Card 
                    className="border-0 shadow-sm action-card position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleHealthTip}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  >
                    <Card.Body className="p-3 text-white text-center">
                      <i className="bi bi-lightbulb mb-2" style={{fontSize: '2rem'}}></i>
                      <h6 className="fw-bold mb-1">Health Tip</h6>
                      <small className="opacity-75">Get daily health advice</small>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3}>
                  <Card 
                    className="border-0 shadow-sm action-card position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleRefreshData}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  >
                    <Card.Body className="p-3 text-white text-center">
                      {refreshing ? (
                        <div className="spinner-border mb-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <i className="bi bi-arrow-clockwise mb-2" style={{fontSize: '2rem'}}></i>
                      )}
                      <h6 className="fw-bold mb-1">Refresh</h6>
                      <small className="opacity-75">Update your data</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        
        {/* Overview Tab */}
        <Tab eventKey="overview" title={<><i className="bi bi-house me-2"></i>Overview</>}>
          <Row className="g-4">
            {/* Upcoming Appointments */}
            <Col lg={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-calendar-event me-2"></i>
                    Upcoming Appointments
                  </h5>
                </Card.Header>
                <Card.Body>
                  {appointments.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border rounded p-3 mb-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="mb-1">{appointment.doctor}</h6>
                              <p className="text-muted mb-1">{appointment.specialty}</p>
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {formatDate(appointment.date)} at {appointment.time}
                              </small>
                            </div>
                            <Badge bg={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="d-flex gap-2">
                            {!appointment.questionnaire_completed && (
                              <Button 
                                size="sm" 
                                variant="warning" 
                                onClick={() => handleCompleteForm(appointment.id)}
                                disabled={buttonLoading[`form-${appointment.id}`]}
                              >
                                {buttonLoading[`form-${appointment.id}`] ? (
                                  <>
                                    <div className="spinner-border spinner-border-sm me-1" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Completing...
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-clipboard-plus me-1"></i>
                                    Complete Pre-Visit Form
                                  </>
                                )}
                              </Button>
                            )}
                            <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(appointment)}>
                              <i className="bi bi-info-circle me-1"></i>
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="info">
                      <i className="bi bi-calendar-x me-2"></i>
                      No upcoming appointments. Book your next visit!
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Medication Reminders */}
            <Col lg={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-alarm me-2"></i>
                    Today's Medications
                  </h5>
                </Card.Header>
                <Card.Body>
                  {medications.length > 0 ? (
                    <div className="space-y-3">
                      {medications.map((medication) => (
                        <div key={medication.id} className="border rounded p-3 mb-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="mb-1">{medication.name}</h6>
                              <p className="text-muted mb-1">{medication.dosage} - {medication.frequency}</p>
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                Next dose: {new Date(medication.nextDose).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </small>
                            </div>
                            <Badge bg={getAdherenceColor(medication.adherence)}>
                              {medication.adherence}% adherence
                            </Badge>
                          </div>
                          <ProgressBar 
                            variant={getAdherenceColor(medication.adherence)}
                            now={medication.adherence} 
                            className="mb-2"
                            style={{height: '6px'}}
                          />
                          <div className="d-flex gap-2">
                            <Button 
                              size="sm" 
                              variant="success" 
                              onClick={() => handleTakeMedication(medication.id)}
                              disabled={buttonLoading[`med_${medication.id}`]}
                            >
                              {buttonLoading[`med_${medication.id}`] ? (
                                <>
                                  <i className="bi bi-arrow-clockwise me-1 spinning"></i>
                                  Taking...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-1"></i>
                                  Mark Taken
                                </>
                              )}
                            </Button>
                            <Button size="sm" variant="outline-info" onClick={handleRefreshData}>
                              <i className="bi bi-clock-history me-1"></i>
                              History
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="info">
                      <i className="bi bi-capsule me-2"></i>
                      No medications prescribed.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Health Insights */}
          <Row className="g-4 mt-0">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-graph-up-arrow me-2"></i>
                    Health Insights & Reminders
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Alert variant="warning" className="mb-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>Reminder:</strong> Complete your pre-visit questionnaire for Dr. Sarah Johnson's appointment on Sep 26.
                      </Alert>
                      <Alert variant="success" className="mb-3">
                        <i className="bi bi-check-circle me-2"></i>
                        <strong>Great job!</strong> You've maintained 88% medication adherence this month.
                      </Alert>
                    </Col>
                    <Col md={6}>
                      <Alert variant="info" className="mb-3">
                        <i className="bi bi-calendar-plus me-2"></i>
                        <strong>Tip:</strong> Schedule your annual physical exam. It's been 8 months since your last visit.
                      </Alert>
                      <Alert variant="primary" className="mb-3">
                        <i className="bi bi-heart-pulse me-2"></i>
                        <strong>Health Goal:</strong> Track your daily water intake and aim for 8 glasses per day.
                      </Alert>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Appointments Tab */}
        <Tab eventKey="appointments" title={<><i className="bi bi-calendar me-2"></i>Appointments</>}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-calendar-event me-2"></i>
                My Appointments
              </h5>
              <Button variant="light" size="sm" onClick={handleBookAppointment}>
                <i className="bi bi-plus-circle me-1"></i>
                Book New Appointment
              </Button>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">Appointment booking system will be implemented here.</p>
              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                This section will include appointment booking, rescheduling, and management features.
              </Alert>
            </Card.Body>
          </Card>
        </Tab>

        {/* Medications Tab */}
        <Tab eventKey="medications" title={<><i className="bi bi-capsule me-2"></i>Medications</>}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-capsule me-2"></i>
                Medication Management
              </h5>
              <Button variant="light" size="sm" onClick={handleAddMedication}>
                <i className="bi bi-plus-circle me-1"></i>
                Add Medication
              </Button>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">Comprehensive medication tracking system will be implemented here.</p>
              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                This section will include medication scheduling, reminders, adherence tracking, and interaction warnings.
              </Alert>
            </Card.Body>
          </Card>
        </Tab>

        {/* Health Records Tab */}
        <Tab eventKey="records" title={<><i className="bi bi-folder-check me-2"></i>Health Records</>}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-folder-check me-2"></i>
                My Health Records
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Personal Information</h6>
                  <p><strong>Age:</strong> {patientData.age}</p>
                  <p><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
                  <p><strong>Email:</strong> {patientData.email}</p>
                  <p><strong>Phone:</strong> {patientData.phone}</p>
                </Col>
                <Col md={6}>
                  <h6>Emergency Contact</h6>
                  <p><strong>Name:</strong> {patientData.emergencyContact.name}</p>
                  <p><strong>Relation:</strong> {patientData.emergencyContact.relation}</p>
                  <p><strong>Phone:</strong> {patientData.emergencyContact.phone}</p>
                </Col>
              </Row>
              <Alert variant="info" className="mt-3">
                <i className="bi bi-info-circle me-2"></i>
                Complete health records including test results, visit summaries, and medical history will be available here.
              </Alert>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Appointment Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-check me-2"></i>
            Appointment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="row">
              <div className="col-md-6">
                <h5><i className="bi bi-person-badge me-2"></i>Doctor Information</h5>
                <p><strong>Name:</strong> {selectedAppointment.doctor}</p>
                <p><strong>Specialty:</strong> {selectedAppointment.specialty}</p>
                <p><strong>Type:</strong> {selectedAppointment.type}</p>
              </div>
              <div className="col-md-6">
                <h5><i className="bi bi-clock me-2"></i>Appointment Details</h5>
                <p><strong>Date:</strong> {formatDate(selectedAppointment.date)}</p>
                <p><strong>Time:</strong> {selectedAppointment.time}</p>
                <p><strong>Status:</strong> 
                  <Badge className={`ms-2 bg-${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </Badge>
                </p>
              </div>
              <div className="col-12 mt-3">
                <h5><i className="bi bi-clipboard-data me-2"></i>Pre-Visit Form</h5>
                {selectedAppointment.questionnaire_completed ? (
                  <Alert variant="success">
                    <i className="bi bi-check-circle me-2"></i>
                    Pre-visit questionnaire has been completed.
                  </Alert>
                ) : (
                  <Alert variant="warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Pre-visit questionnaire is pending. Please complete before your appointment.
                  </Alert>
                )}
              </div>
              <div className="col-12 mt-3">
                <h5><i className="bi bi-geo-alt me-2"></i>Location & Instructions</h5>
                <p><strong>Address:</strong> Medi-Assist Medical Center, 123 Health Street, Suite 400</p>
                <p><strong>Instructions:</strong> Please arrive 15 minutes early. Bring your insurance card and a list of current medications.</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {selectedAppointment && !selectedAppointment.questionnaire_completed && (
            <Button variant="warning" onClick={() => {
              setShowDetailsModal(false);
              handleCompleteForm(selectedAppointment.id);
            }}>
              <i className="bi bi-clipboard-plus me-2"></i>
              Complete Pre-Visit Form
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* CSS Animations */}
      <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .border-warning {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
        }
      `}</style>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={4000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? '✅ Success' : toastVariant === 'danger' ? '🚨 Emergency' : '📋 Info'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white fs-6">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default PatientDashboard;