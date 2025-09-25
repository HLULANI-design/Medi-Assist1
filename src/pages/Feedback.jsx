import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, Spinner, ListGroup, Toast, ToastContainer } from 'react-bootstrap';
import { api, apiUtils } from '../api';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterRating, setFilterRating] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    pendingReviews: 0
  });
  const [statusUpdating, setStatusUpdating] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [feedbackRes, patientsRes, doctorsRes] = await Promise.all([
        api.feedback.getAll(),
        api.patients.getAll(),
        api.doctors.getAll()
      ]);

      if (feedbackRes.success) {
        const feedbackData = feedbackRes.data;
        setFeedback(feedbackData);
        
        // Calculate stats
        const totalFeedback = feedbackData.length;
        const averageRating = totalFeedback > 0 
          ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback 
          : 0;
        const pendingReviews = feedbackData.filter(f => f.status === 'Pending').length;
        
        setStats({
          totalFeedback,
          averageRating: Math.round(averageRating * 10) / 10,
          pendingReviews
        });
      } else {
        throw new Error(feedbackRes.message || 'Failed to fetch feedback');
      }

      if (patientsRes.success) {
        setPatients(patientsRes.data);
      }

      if (doctorsRes.success) {
        setDoctors(doctorsRes.data);
      }
    } catch (error) {
      console.error('Error initializing feedback data:', error);
      setError(apiUtils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async (filters = {}) => {
    try {
      setError(null);
      const response = await api.feedback.getAll(filters);
      
      if (response.success) {
        setFeedback(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch feedback');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError(apiUtils.formatError(error));
    }
  };

  const handleStatusUpdate = async (feedbackId, newStatus) => {
    setStatusUpdating(prev => ({...prev, [feedbackId]: true}));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update feedback status
      setFeedback(feedback.map(f => 
        f.id === feedbackId ? { ...f, status: newStatus } : f
      ));
      
      // Update stats
      const updatedFeedback = feedback.map(f => 
        f.id === feedbackId ? { ...f, status: newStatus } : f
      );
      const pendingReviews = updatedFeedback.filter(f => f.status === 'Pending').length;
      setStats(prev => ({ ...prev, pendingReviews }));
      
      const statusMessages = {
        'Reviewed': '✅ Feedback reviewed and acknowledged!',
        'Addressed': '🎯 Feedback addressed and resolved!',
        'Pending': '⏳ Feedback marked as pending review.'
      };
      
      setToastMessage(statusMessages[newStatus] || '✅ Feedback status updated successfully!');
      setToastVariant('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error updating feedback status:', error);
      setToastMessage('❌ Failed to update feedback status. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setStatusUpdating(prev => ({...prev, [feedbackId]: false}));
    }
  };

  const handleFilterChange = async (filterType, value) => {
    if (filterType === 'rating') {
      setFilterRating(value);
    } else if (filterType === 'status') {
      setFilterStatus(value);
    }

    const filters = {};
    if (filterType === 'rating' ? value : filterRating) {
      filters.rating = filterType === 'rating' ? value : filterRating;
    }
    if (filterType === 'status' ? value : filterStatus) {
      filters.status = filterType === 'status' ? value : filterStatus;
    }

    await fetchFeedback(filters);
  };

  const handleViewFeedback = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setShowViewModal(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'reviewed': return 'success';
      case 'addressed': return 'primary';
      default: return 'secondary';
    }
  };

  const getRatingBadgeVariant = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : `Patient ${patientId}`;
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.name}` : `Doctor ${doctorId}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading feedback...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-gradient mb-1">Patient Feedback</h2>
          <p className="text-muted mb-0">Review and manage patient feedback and ratings</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-6 text-primary mb-2">
                <i className="bi bi-chat-square-text"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.totalFeedback}</h3>
              <p className="text-muted mb-0">Total Feedback</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-6 text-warning mb-2">
                <i className="bi bi-star-fill"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.averageRating}</h3>
              <p className="text-muted mb-0">Average Rating</p>
              <div className="mt-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-6 text-warning mb-2">
                <i className="bi bi-clock"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.pendingReviews}</h3>
              <p className="text-muted mb-0">Pending Reviews</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Filter by Rating</Form.Label>
                <Form.Select 
                  value={filterRating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select 
                  value={filterStatus}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Addressed">Addressed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={() => {
                setFilterRating('');
                setFilterStatus('');
                fetchFeedback();
              }}>
                <i className="bi bi-funnel me-1"></i>
                Clear Filters
              </Button>
              <Button variant="outline-secondary" className="ms-2" onClick={() => fetchFeedback()}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Feedback Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-chat-square-text me-2"></i>
              Patient Feedback ({feedback.length})
            </h5>
            {loading && <Spinner animation="border" size="sm" />}
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {feedback.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-chat-square-text display-1 text-muted mb-3"></i>
              <h5 className="text-muted">No feedback found</h5>
              <p className="text-muted">Feedback from patients will appear here</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Rating</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((feedbackItem) => (
                  <tr key={feedbackItem.id}>
                    <td>
                      <code>FB{String(feedbackItem.id).padStart(3, '0')}</code>
                    </td>
                    <td>
                      <div className="fw-medium">{getPatientName(feedbackItem.patientId)}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{getDoctorName(feedbackItem.doctorId)}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Badge bg={getRatingBadgeVariant(feedbackItem.rating)} className="me-2">
                          {feedbackItem.rating}
                        </Badge>
                        <div>
                          {renderStars(feedbackItem.rating)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="outline-info" className="border">
                        {feedbackItem.category}
                      </Badge>
                    </td>
                    <td>
                      <small>{formatDate(feedbackItem.date)}</small>
                    </td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(feedbackItem.status)}>
                        {feedbackItem.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewFeedback(feedbackItem)}
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        {feedbackItem.status === 'Pending' && (
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleStatusUpdate(feedbackItem.id, 'Reviewed')}
                            disabled={statusUpdating[feedbackItem.id]}
                            title="Mark as Reviewed"
                          >
                            {statusUpdating[feedbackItem.id] ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              <i className="bi bi-check"></i>
                            )}
                          </Button>
                        )}
                        {feedbackItem.status === 'Reviewed' && (
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            onClick={() => handleStatusUpdate(feedbackItem.id, 'Addressed')}
                            disabled={statusUpdating[feedbackItem.id]}
                            title="Mark as Addressed"
                          >
                            {statusUpdating[feedbackItem.id] ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              <i className="bi bi-check-circle"></i>
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* View Feedback Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-chat-square-text me-2"></i>
            Feedback Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-muted mb-2">Patient Information</h6>
                  <p className="fw-medium mb-1">{getPatientName(selectedFeedback.patientId)}</p>
                  <p className="fw-medium mb-3">{getDoctorName(selectedFeedback.doctorId)}</p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted mb-2">Feedback Details</h6>
                  <div className="mb-2">
                    <Badge bg={getRatingBadgeVariant(selectedFeedback.rating)} className="me-2">
                      {selectedFeedback.rating}/5
                    </Badge>
                    {renderStars(selectedFeedback.rating)}
                  </div>
                  <p className="mb-1">
                    <Badge bg="outline-info" className="border">
                      {selectedFeedback.category}
                    </Badge>
                  </p>
                  <small className="text-muted">{formatDate(selectedFeedback.date)}</small>
                </Col>
              </Row>

              <div className="mb-4">
                <h6 className="text-muted mb-2">Comments</h6>
                <div className="p-3 bg-light rounded">
                  <p className="mb-0">{selectedFeedback.comments || 'No additional comments provided.'}</p>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-muted mb-2">Current Status</h6>
                <Badge bg={getStatusBadgeVariant(selectedFeedback.status)} className="fs-6">
                  {selectedFeedback.status}
                </Badge>
              </div>

              {selectedFeedback.suggestions && selectedFeedback.suggestions.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Suggestions for Improvement</h6>
                  <ListGroup>
                    {selectedFeedback.suggestions.map((suggestion, index) => (
                      <ListGroup.Item key={index} className="border-0 bg-light">
                        <i className="bi bi-lightbulb me-2 text-warning"></i>
                        {suggestion}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedFeedback?.status === 'Pending' && (
            <Button 
              variant="success"
              onClick={() => {
                handleStatusUpdate(selectedFeedback.id, 'Reviewed');
                setShowViewModal(false);
              }}
            >
              <i className="bi bi-check me-1"></i>
              Mark as Reviewed
            </Button>
          )}
          {selectedFeedback?.status === 'Reviewed' && (
            <Button 
              variant="primary"
              onClick={() => {
                handleStatusUpdate(selectedFeedback.id, 'Addressed');
                setShowViewModal(false);
              }}
            >
              <i className="bi bi-check-circle me-1"></i>
              Mark as Addressed
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer className="p-3" position="top-end">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={4000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? '✅ Success' : 
               toastVariant === 'danger' ? '❌ Error' : '⚠️ Info'}
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

export default Feedback;