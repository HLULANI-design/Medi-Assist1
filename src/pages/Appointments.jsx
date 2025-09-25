import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, Spinner, InputGroup, Toast, ToastContainer } from 'react-bootstrap';
import { api, apiUtils } from '../api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Consultation',
    notes: '',
    duration: 30
  });
  const [submitting, setSubmitting] = useState(false);
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
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        api.appointments.getAll(),
        api.patients.getAll(),
        api.doctors.getAll()
      ]);

      if (appointmentsRes.success) {
        setAppointments(appointmentsRes.data);
      } else {
        throw new Error(appointmentsRes.message || 'Failed to fetch appointments');
      }

      if (patientsRes.success) {
        setPatients(patientsRes.data);
      }

      if (doctorsRes.success) {
        setDoctors(doctorsRes.data);
      }
    } catch (error) {
      console.error('Error initializing appointments data:', error);
      setError(apiUtils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (filters = {}) => {
    try {
      setError(null);
      const response = await api.appointments.getAll(filters);
      
      if (response.success) {
        setAppointments(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(apiUtils.formatError(error));
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Combine date and time
      const appointmentDateTime = `${newAppointment.date}T${newAppointment.time}:00.000Z`;
      
      const appointmentData = {
        ...newAppointment,
        patientId: parseInt(newAppointment.patientId),
        doctorId: parseInt(newAppointment.doctorId),
        dateTime: appointmentDateTime,
        duration: parseInt(newAppointment.duration)
      };
      
      const response = await api.appointments.create(appointmentData);
      
      if (response.success) {
        setAppointments([response.data, ...appointments]);
        setNewAppointment({
          patientId: '',
          doctorId: '',
          date: '',
          time: '',
          type: 'Consultation',
          notes: '',
          duration: 30
        });
        setShowAddModal(false);
      } else {
        throw new Error(response.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      setError(apiUtils.formatError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setStatusUpdating(prev => ({...prev, [appointmentId]: true}));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the appointment status
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
      
      const statusMessages = {
        'In-Progress': '▶️ Appointment started successfully!',
        'Completed': '✅ Appointment completed and logged!',
        'Cancelled': '❌ Appointment cancelled and patient notified!'
      };
      
      setToastMessage(statusMessages[newStatus] || '✅ Status updated successfully!');
      setToastVariant(newStatus === 'Cancelled' ? 'warning' : 'success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error updating appointment:', error);
      setToastMessage('❌ Failed to update appointment status. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setStatusUpdating(prev => ({...prev, [appointmentId]: false}));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = async (filterType, value) => {
    if (filterType === 'date') {
      setFilterDate(value);
    } else if (filterType === 'status') {
      setFilterStatus(value);
    }

    const filters = {};
    if (filterType === 'date' ? value : filterDate) {
      filters.date = filterType === 'date' ? value : filterDate;
    }
    if (filterType === 'status' ? value : filterStatus) {
      filters.status = filterType === 'status' ? value : filterStatus;
    }

    await fetchAppointments(filters);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'in-progress': return 'warning';
      default: return 'secondary';
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : `Patient ${patientId}`;
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.name}` : `Doctor ${doctorId}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not specified';
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Generate time slots for appointment scheduling
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading appointments...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-gradient mb-1">Appointment Management</h2>
          <p className="text-muted mb-0">Schedule and manage patient appointments</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-calendar-plus me-1"></i>
          Schedule Appointment
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Filter by Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filterDate}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                />
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
                  <option value="Scheduled">Scheduled</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={() => {
                setFilterDate('');
                setFilterStatus('');
                fetchAppointments();
              }}>
                <i className="bi bi-funnel me-1"></i>
                Clear Filters
              </Button>
              <Button variant="outline-secondary" className="ms-2" onClick={() => fetchAppointments()}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-calendar-check me-2"></i>
              Appointments ({appointments.length})
            </h5>
            {loading && <Spinner animation="border" size="sm" />}
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {appointments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
              <h5 className="text-muted">No appointments found</h5>
              <p className="text-muted">Schedule your first appointment to get started</p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                Schedule Appointment
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <code>APT{String(appointment.id).padStart(3, '0')}</code>
                    </td>
                    <td>
                      <div className="fw-medium">{getPatientName(appointment.patientId)}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{getDoctorName(appointment.doctorId)}</div>
                    </td>
                    <td>
                      <small>{formatDateTime(appointment.dateTime)}</small>
                    </td>
                    <td>
                      <Badge bg="outline-info" className="border">
                        {appointment.type}
                      </Badge>
                    </td>
                    <td>{appointment.duration} min</td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {appointment.status === 'Scheduled' && (
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'In-Progress')}
                            disabled={statusUpdating[appointment.id]}
                            title="Start Appointment"
                          >
                            {statusUpdating[appointment.id] ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              <i className="bi bi-play"></i>
                            )}
                          </Button>
                        )}
                        {appointment.status === 'In-Progress' && (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'Completed')}
                            disabled={statusUpdating[appointment.id]}
                            title="Complete Appointment"
                          >
                            {statusUpdating[appointment.id] ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              <i className="bi bi-check"></i>
                            )}
                          </Button>
                        )}
                        <Button variant="outline-secondary" size="sm" title="Edit">
                          <i className="bi bi-pencil"></i>
                        </Button>
                        {appointment.status === 'Scheduled' && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'Cancelled')}
                            disabled={statusUpdating[appointment.id]}
                            title="Cancel Appointment"
                          >
                            {statusUpdating[appointment.id] ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              <i className="bi bi-x"></i>
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

      {/* Add Appointment Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-plus me-2"></i>
            Schedule New Appointment
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAppointment}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Patient *</Form.Label>
                  <Form.Select
                    name="patientId"
                    value={newAppointment.patientId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Doctor *</Form.Label>
                  <Form.Select
                    name="doctorId"
                    value={newAppointment.doctorId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newAppointment.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Time *</Form.Label>
                  <Form.Select
                    name="time"
                    value={newAppointment.time}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select time</option>
                    {generateTimeSlots().map(time => (
                      <option key={time} value={time}>
                        {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Appointment Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={newAppointment.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency">Emergency</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Select
                    name="duration"
                    value={newAppointment.duration}
                    onChange={handleInputChange}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={newAppointment.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional notes for the appointment..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Scheduling...
                </>
              ) : (
                <>
                  <i className="bi bi-calendar-plus me-1"></i>
                  Schedule Appointment
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
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
               toastVariant === 'danger' ? '❌ Error' : '⚠️ Warning'}
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

export default Appointments;