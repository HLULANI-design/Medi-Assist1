import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';

const DoctorRating = () => {
  const [completedAppointments, setCompletedAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2025-09-20',
      time: '10:30 AM',
      type: 'Follow-up',
      rated: false,
      consultationFee: 150
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Medicine',
      date: '2025-09-18',
      time: '2:15 PM',
      type: 'Consultation',
      rated: true,
      rating: 5,
      consultationFee: 120
    },
    {
      id: 3,
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      date: '2025-09-15',
      time: '11:00 AM',
      type: 'Routine Checkup',
      rated: false,
      consultationFee: 140
    }
  ]);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const [ratingData, setRatingData] = useState({
    overallRating: 0,
    punctuality: 0,
    communication: 0,
    professionalism: 0,
    facilities: 0,
    waitTime: 0,
    wouldRecommend: true,
    treatmentSatisfaction: 0,
    followUpCare: 0,
    comments: '',
    specificFeedback: {
      whatWentWell: '',
      improvements: '',
      additionalComments: ''
    },
    anonymous: false
  });

  const ratingCategories = [
    {
      key: 'overallRating',
      label: 'Overall Experience',
      icon: 'star',
      color: 'primary',
      description: 'How satisfied are you with your overall experience?'
    },
    {
      key: 'punctuality',
      label: 'Punctuality',
      icon: 'clock',
      color: 'info',
      description: 'Was your appointment on time?'
    },
    {
      key: 'communication',
      label: 'Communication',
      icon: 'chat-dots',
      color: 'success',
      description: 'How well did the doctor explain things?'
    },
    {
      key: 'professionalism',
      label: 'Professionalism',
      icon: 'person-check',
      color: 'primary',
      description: 'How professional was the doctor and staff?'
    },
    {
      key: 'facilities',
      label: 'Facilities & Cleanliness',
      icon: 'building',
      color: 'secondary',
      description: 'How would you rate the clinic facilities?'
    },
    {
      key: 'waitTime',
      label: 'Wait Time',
      icon: 'hourglass',
      color: 'warning',
      description: 'How reasonable was the waiting time?'
    },
    {
      key: 'treatmentSatisfaction',
      label: 'Treatment Satisfaction',
      icon: 'heart-pulse',
      color: 'danger',
      description: 'How satisfied are you with the treatment received?'
    },
    {
      key: 'followUpCare',
      label: 'Follow-up Care',
      icon: 'arrow-repeat',
      color: 'info',
      description: 'How satisfied are you with follow-up instructions?'
    }
  ];

  const openRatingModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRatingModal(true);
    // Reset form
    setRatingData({
      overallRating: 0,
      punctuality: 0,
      communication: 0,
      professionalism: 0,
      facilities: 0,
      waitTime: 0,
      wouldRecommend: true,
      treatmentSatisfaction: 0,
      followUpCare: 0,
      comments: '',
      specificFeedback: {
        whatWentWell: '',
        improvements: '',
        additionalComments: ''
      },
      anonymous: false
    });
  };

  const handleRatingChange = (category, value) => {
    setRatingData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleFeedbackChange = (field, value) => {
    setRatingData(prev => ({
      ...prev,
      specificFeedback: {
        ...prev.specificFeedback,
        [field]: value
      }
    }));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    if (rating >= 2) return 'orange';
    return 'danger';
  };

  const getRatingText = (rating) => {
    if (rating === 5) return 'Excellent';
    if (rating === 4) return 'Good';
    if (rating === 3) return 'Average';
    if (rating === 2) return 'Poor';
    if (rating === 1) return 'Very Poor';
    return 'Not Rated';
  };

  const calculateAverageRating = () => {
    const ratings = ratingCategories.map(cat => ratingData[cat.key]).filter(rating => rating > 0);
    if (ratings.length === 0) return 0;
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
  };

  const handleSubmitRating = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const submissionData = {
        appointmentId: selectedAppointment.id,
        doctorName: selectedAppointment.doctor,
        patientId: 'current-patient-id',
        ratings: ratingData,
        averageRating: calculateAverageRating(),
        submittedAt: new Date().toISOString(),
        anonymous: ratingData.anonymous
      };
      
      console.log('Submitting doctor rating:', submissionData);
      
      // Update appointment status
      setCompletedAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, rated: true, rating: parseFloat(calculateAverageRating()) }
          : apt
      ));
      
      setShowRatingModal(false);
      setToastMessage('🌟 Thank you for your feedback! Your rating has been submitted successfully.');
      setToastVariant('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      setToastMessage('❌ Failed to submit rating. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Quick demo function for instant rating
  const handleQuickRateDemo = (appointment) => {
    setCompletedAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, rated: true, rating: 5 }
        : apt
    ));
    setToastMessage(`⭐ 5-star rating submitted for ${appointment.doctor}!`);
    setToastVariant('success');
    setShowToast(true);
  };

  const renderStarRating = (category, value, onChange) => {
    return (
      <div className="d-flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Button
            key={star}
            variant="link"
            className="p-0 border-0"
            style={{ fontSize: '24px', color: star <= value ? '#ffc107' : '#dee2e6' }}
            onClick={() => onChange(category, star)}
          >
            <i className="bi bi-star-fill"></i>
          </Button>
        ))}
        <span className="ms-2 align-self-center">
          <Badge bg={getRatingColor(value)} className="ms-1">
            {getRatingText(value)}
          </Badge>
        </span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="bi bi-star text-warning me-2"></i>
                Rate Your Experience
              </h2>
              <p className="text-muted mb-0">Share feedback about your completed appointments</p>
            </div>
            <Badge bg="info" className="fs-6">
              {completedAppointments.filter(apt => !apt.rated).length} Pending Reviews
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Pending Ratings */}
      <Row className="g-4 mb-5">
        <Col>
          <h4 className="mb-3">
            <i className="bi bi-hourglass me-2 text-warning"></i>
            Appointments Awaiting Your Feedback
          </h4>
        </Col>
        {completedAppointments.filter(apt => !apt.rated).map(appointment => (
          <Col lg={6} xl={4} key={appointment.id}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <i className="bi bi-star me-2"></i>
                    Rate This Visit
                  </h6>
                  <Badge bg="warning">Pending</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <h5 className="mb-2">{appointment.doctor}</h5>
                <p className="text-muted mb-2">{appointment.specialty}</p>
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {formatDate(appointment.date)} at {appointment.time}
                  </small>
                  <br />
                  <small className="text-muted">
                    <i className="bi bi-tag me-1"></i>
                    {appointment.type}
                  </small>
                </div>
                <Alert variant="info" className="mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  <small>Help others by sharing your experience with this doctor.</small>
                </Alert>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-grow-1"
                    onClick={() => openRatingModal(appointment)}
                  >
                    <i className="bi bi-star me-2"></i>
                    Rate & Review
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleQuickRateDemo(appointment)}
                  >
                    <i className="bi bi-lightning-fill"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Completed Ratings */}
      <Row className="g-4">
        <Col>
          <h4 className="mb-3">
            <i className="bi bi-check-circle me-2 text-success"></i>
            Your Previous Reviews
          </h4>
        </Col>
        {completedAppointments.filter(apt => apt.rated).map(appointment => (
          <Col lg={6} xl={4} key={appointment.id}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-success text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <i className="bi bi-check-circle me-2"></i>
                    Review Submitted
                  </h6>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star-fill me-1"></i>
                    <span>{appointment.rating}</span>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <h5 className="mb-2">{appointment.doctor}</h5>
                <p className="text-muted mb-2">{appointment.specialty}</p>
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {formatDate(appointment.date)} at {appointment.time}
                  </small>
                  <br />
                  <small className="text-muted">
                    <i className="bi bi-tag me-1"></i>
                    {appointment.type}
                  </small>
                </div>
                <Alert variant="success" className="mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  <small>Thank you for your feedback!</small>
                </Alert>
                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => openRatingModal(appointment)}
                >
                  <i className="bi bi-eye me-2"></i>
                  View Review
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {completedAppointments.filter(apt => !apt.rated).length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Great! All your recent appointments have been reviewed. Your feedback helps improve our services.
        </Alert>
      )}

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-star text-warning me-2"></i>
            Rate Your Experience
            {selectedAppointment && (
              <div className="fs-6 text-muted mt-1">
                {selectedAppointment.doctor} - {formatDate(selectedAppointment.date)}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {selectedAppointment && (
            <div className="mb-4">
              <Alert variant="primary">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Your feedback matters!</strong> Help other patients make informed decisions and help us improve our services.
              </Alert>
            </div>
          )}

          {/* Rating Categories */}
          <Row className="g-4 mb-4">
            {ratingCategories.map((category, index) => (
              <Col md={6} key={category.key}>
                <Card className="border-0 bg-light">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-start">
                      <div className={`text-${category.color} me-3`}>
                        <i className={`bi bi-${category.icon}`} style={{fontSize: '24px'}}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{category.label}</h6>
                        <small className="text-muted mb-2 d-block">{category.description}</small>
                        {renderStarRating(category.key, ratingData[category.key], handleRatingChange)}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Overall Rating Summary */}
          <Card className="mb-4 border-primary">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-calculator me-2"></i>
                Overall Rating Summary
              </h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <div className="me-3">
                  <h2 className="text-primary mb-0">{calculateAverageRating()}</h2>
                  <div className="text-warning">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i 
                        key={star}
                        className={`bi bi-star${star <= Math.round(calculateAverageRating()) ? '-fill' : ''} me-1`}
                      ></i>
                    ))}
                  </div>
                </div>
                <div>
                  <Badge bg={getRatingColor(calculateAverageRating())} className="fs-6">
                    {getRatingText(Math.round(calculateAverageRating()))}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Recommendation */}
          <Card className="mb-4">
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">
                <i className="bi bi-hand-thumbs-up me-2"></i>
                Would you recommend this doctor?
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Check
                type="radio"
                id="recommend-yes"
                name="recommend"
                checked={ratingData.wouldRecommend === true}
                onChange={() => setRatingData(prev => ({ ...prev, wouldRecommend: true }))}
                label="Yes, I would recommend this doctor"
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="recommend-no"
                name="recommend"
                checked={ratingData.wouldRecommend === false}
                onChange={() => setRatingData(prev => ({ ...prev, wouldRecommend: false }))}
                label="No, I would not recommend this doctor"
              />
            </Card.Body>
          </Card>

          {/* Written Feedback */}
          <Card className="mb-4">
            <Card.Header className="bg-secondary text-white">
              <h6 className="mb-0">
                <i className="bi bi-chat-square-text me-2"></i>
                Written Feedback (Optional)
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">What went well during your visit?</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={ratingData.specificFeedback.whatWentWell}
                  onChange={(e) => handleFeedbackChange('whatWentWell', e.target.value)}
                  placeholder="Share what you appreciated about your experience..."
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">What could be improved?</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={ratingData.specificFeedback.improvements}
                  onChange={(e) => handleFeedbackChange('improvements', e.target.value)}
                  placeholder="Suggest areas for improvement..."
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Additional Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={ratingData.specificFeedback.additionalComments}
                  onChange={(e) => handleFeedbackChange('additionalComments', e.target.value)}
                  placeholder="Any other feedback you'd like to share..."
                />
              </Form.Group>
              
              <Form.Check
                type="checkbox"
                id="anonymous"
                checked={ratingData.anonymous}
                onChange={(e) => setRatingData(prev => ({ ...prev, anonymous: e.target.checked }))}
                label="Submit this review anonymously"
                className="text-muted"
              />
            </Card.Body>
          </Card>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitRating}
            disabled={loading || calculateAverageRating() === '0.0'}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Submit Review
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={5000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : 'Error'}
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

export default DoctorRating;