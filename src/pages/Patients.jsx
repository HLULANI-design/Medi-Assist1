import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { api, apiUtils } from '../api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    conditions: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    insurance: {
      provider: '',
      policyNumber: ''
    }
  });
  const [questionnaire, setQuestionnaire] = useState({
    // Chief Complaint
    chiefComplaint: '',
    symptomDuration: '',
    symptomSeverity: '1',
    
    // Pain Assessment
    painLevel: '0',
    painLocation: '',
    painType: '',
    painTriggers: '',
    
    // General Health
    currentMedications: '',
    allergies: '',
    recentIllnesses: '',
    familyHistory: '',
    
    // Lifestyle
    smokingStatus: 'never',
    alcoholConsumption: 'never',
    exerciseFrequency: 'rarely',
    sleepHours: '7-8',
    
    // Recent Changes
    appetiteChange: 'no_change',
    weightChange: 'no_change',
    moodChanges: '',
    
    // Specific Questions
    lastPhysicalExam: '',
    vaccinationStatus: 'up_to_date',
    menstrualHistory: '', // for female patients
    
    // Additional Notes
    additionalConcerns: '',
    questionsForDoctor: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.patients.getAll(searchParams);
      
      if (response.success) {
        setPatients(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(apiUtils.formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 2 || term.length === 0) {
      await fetchPatients({ search: term });
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Process the form data
      const patientData = {
        ...newPatient,
        age: parseInt(newPatient.age),
        conditions: newPatient.conditions.split(',').map(c => c.trim()).filter(c => c),
        // Only include insurance if both fields are filled
        insurance: (newPatient.insurance.provider && newPatient.insurance.policyNumber) 
          ? newPatient.insurance 
          : null
      };
      
      const response = await api.patients.create(patientData);
      
      if (response.success) {
        setPatients([response.data, ...patients]);
        setNewPatient({
          name: '',
          age: '',
          gender: 'Male',
          email: '',
          phone: '',
          address: '',
          bloodGroup: '',
          conditions: '',
          emergencyContact: { name: '', phone: '', relation: '' },
          insurance: { provider: '', policyNumber: '' }
        });
        setShowAddModal(false);
        
        // Show success toast
        setToastMessage('👤 New patient added successfully to the system!');
        setToastVariant('success');
        setShowToast(true);
      } else {
        throw new Error(response.message || 'Failed to create patient');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      setError(apiUtils.formatError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setNewPatient(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else if (name.startsWith('insurance.')) {
      const field = name.split('.')[1];
      setNewPatient(prev => ({
        ...prev,
        insurance: {
          ...prev.insurance,
          [field]: value
        }
      }));
    } else {
      setNewPatient(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleQuestionnaireChange = (e) => {
    const { name, value } = e.target;
    setQuestionnaire(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionnaireSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // In a real app, this would save to the database
      // For now, we'll simulate saving the questionnaire
      const questionnaireData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        questionnaire: questionnaire,
        submittedAt: new Date().toISOString(),
        status: 'pending_review'
      };
      
      console.log('Submitting pre-visit questionnaire:', questionnaireData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setQuestionnaire({
        chiefComplaint: '',
        symptomDuration: '',
        symptomSeverity: '1',
        painLevel: '0',
        painLocation: '',
        painType: '',
        painTriggers: '',
        currentMedications: '',
        allergies: '',
        recentIllnesses: '',
        familyHistory: '',
        smokingStatus: 'never',
        alcoholConsumption: 'never',
        exerciseFrequency: 'rarely',
        sleepHours: '7-8',
        appetiteChange: 'no_change',
        weightChange: 'no_change',
        moodChanges: '',
        lastPhysicalExam: '',
        vaccinationStatus: 'up_to_date',
        menstrualHistory: '',
        additionalConcerns: '',
        questionsForDoctor: ''
      });
      setShowQuestionnaireModal(false);
      
      // Show success message
      setToastMessage('Pre-visit questionnaire submitted successfully! Your doctor will review it before your appointment.');
      setToastVariant('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setError('Failed to submit questionnaire. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const openQuestionnaire = (patient) => {
    setSelectedPatient(patient);
    setShowQuestionnaireModal(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      default: return 'primary';
    }
  };

  if (loading && !patients.length) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading patients...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-gradient mb-1">Patient Management</h2>
          <p className="text-muted mb-0">Manage patient records and information</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus me-1"></i>
          Add New Patient
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search patients by name or ID..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
            <Col md={3}>
              <Form.Select onChange={(e) => fetchPatients({ status: e.target.value })}>
                <option value="">All Patients</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <Button variant="outline-secondary" onClick={() => fetchPatients()}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Patients Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-people me-2"></i>
              Patients ({patients.length})
            </h5>
            {loading && <Spinner animation="border" size="sm" />}
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {patients.length === 0 && !loading ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted mb-3"></i>
              <h5 className="text-muted">No patients found</h5>
              <p className="text-muted">Add your first patient to get started</p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                Add Patient
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Blood Group</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <code>{patient.patientId || `PAT${String(patient.id).padStart(3, '0')}`}</code>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{patient.name}</div>
                        <small className="text-muted">{patient.email}</small>
                      </div>
                    </td>
                    <td>{patient.age}</td>
                    <td>{patient.gender || 'N/A'}</td>
                    <td>
                      <small>{patient.phone}</small>
                    </td>
                    <td>
                      <Badge bg="outline-primary" className="border">
                        {patient.bloodGroup || 'N/A'}
                      </Badge>
                    </td>
                    <td>
                      <small>{patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}</small>
                    </td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(patient.status)}>
                        {patient.status || 'Active'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => openQuestionnaire(patient)}
                          title="Pre-Visit Questionnaire"
                        >
                          <i className="bi bi-clipboard-check"></i>
                        </Button>
                        <Button variant="outline-primary" size="sm" title="View Details">
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button variant="outline-secondary" size="sm" title="Edit">
                          <i className="bi bi-pencil"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add Patient Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-plus me-2"></i>
            Add New Patient
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddPatient}>
          <Modal.Body>
            <Row className="g-3">
              {/* Basic Information */}
              <Col md={12}>
                <h6 className="text-primary mb-3">Basic Information</h6>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newPatient.name}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="120"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select
                    name="gender"
                    value={newPatient.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newPatient.email}
                    onChange={handleInputChange}
                    required
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
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={newPatient.address}
                    onChange={handleInputChange}
                    placeholder="Complete address"
                  />
                </Form.Group>
              </Col>
              
              {/* Medical Information */}
              <Col md={12}>
                <h6 className="text-primary mb-3 mt-3">Medical Information</h6>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Select
                    name="bloodGroup"
                    value={newPatient.bloodGroup}
                    onChange={handleInputChange}
                  >
                    <option value="">Select blood group</option>
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
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Medical Conditions</Form.Label>
                  <Form.Control
                    type="text"
                    name="conditions"
                    value={newPatient.conditions}
                    onChange={handleInputChange}
                    placeholder="Comma-separated conditions"
                  />
                  <Form.Text className="text-muted">
                    Separate multiple conditions with commas
                  </Form.Text>
                </Form.Group>
              </Col>
              
              {/* Emergency Contact */}
              <Col md={12}>
                <h6 className="text-primary mb-3 mt-3">Emergency Contact</h6>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContact.name"
                    value={newPatient.emergencyContact.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="emergencyContact.phone"
                    value={newPatient.emergencyContact.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContact.relation"
                    value={newPatient.emergencyContact.relation}
                    onChange={handleInputChange}
                    placeholder="e.g., Spouse, Parent"
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
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-1"></i>
                  Add Patient
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Pre-Visit Questionnaire Modal */}
      <Modal show={showQuestionnaireModal} onHide={() => setShowQuestionnaireModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-clipboard-check me-2 text-success"></i>
            Pre-Visit Health Questionnaire
            {selectedPatient && (
              <span className="fs-6 text-muted ms-2">for {selectedPatient.name}</span>
            )}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleQuestionnaireSubmit}>
          <Modal.Body className="px-4">
            <Alert variant="info" className="mb-4">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Help us prepare for your visit!</strong> Please answer these questions to help your doctor provide the best care possible. This information will be reviewed before your appointment.
            </Alert>

            <div className="questionnaire-sections">
              {/* Chief Complaint Section */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0"><i className="bi bi-chat-dots me-2"></i>Main Reason for Visit</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">What is the main reason for your visit today? *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="chiefComplaint"
                          value={questionnaire.chiefComplaint}
                          onChange={handleQuestionnaireChange}
                          placeholder="Describe your symptoms, concerns, or the reason for this appointment..."
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">How long have you had these symptoms?</Form.Label>
                        <Form.Select
                          name="symptomDuration"
                          value={questionnaire.symptomDuration}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="">Select duration</option>
                          <option value="less_than_1_day">Less than 1 day</option>
                          <option value="1-3_days">1-3 days</option>
                          <option value="1_week">About 1 week</option>
                          <option value="2-4_weeks">2-4 weeks</option>
                          <option value="1-3_months">1-3 months</option>
                          <option value="more_than_3_months">More than 3 months</option>
                          <option value="chronic">Chronic/Ongoing</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">How severe are your symptoms? (1-10)</Form.Label>
                        <Form.Range
                          name="symptomSeverity"
                          value={questionnaire.symptomSeverity}
                          onChange={handleQuestionnaireChange}
                          min="1"
                          max="10"
                        />
                        <div className="d-flex justify-content-between small text-muted">
                          <span>1 (Mild)</span>
                          <span className="fw-bold">Current: {questionnaire.symptomSeverity}</span>
                          <span>10 (Severe)</span>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Pain Assessment */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-warning text-dark">
                  <h6 className="mb-0"><i className="bi bi-bandaid me-2"></i>Pain Assessment</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Current pain level (0-10)</Form.Label>
                        <Form.Range
                          name="painLevel"
                          value={questionnaire.painLevel}
                          onChange={handleQuestionnaireChange}
                          min="0"
                          max="10"
                        />
                        <div className="d-flex justify-content-between small text-muted">
                          <span>0 (No pain)</span>
                          <span className="fw-bold">Current: {questionnaire.painLevel}</span>
                          <span>10 (Worst pain)</span>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Where is the pain located?</Form.Label>
                        <Form.Control
                          type="text"
                          name="painLocation"
                          value={questionnaire.painLocation}
                          onChange={handleQuestionnaireChange}
                          placeholder="e.g., lower back, right knee, chest..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">How would you describe the pain?</Form.Label>
                        <Form.Select
                          name="painType"
                          value={questionnaire.painType}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="">Select pain type</option>
                          <option value="sharp">Sharp/Stabbing</option>
                          <option value="dull">Dull/Aching</option>
                          <option value="burning">Burning</option>
                          <option value="throbbing">Throbbing</option>
                          <option value="cramping">Cramping</option>
                          <option value="tingling">Tingling/Numbness</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">What makes the pain better or worse?</Form.Label>
                        <Form.Control
                          type="text"
                          name="painTriggers"
                          value={questionnaire.painTriggers}
                          onChange={handleQuestionnaireChange}
                          placeholder="e.g., movement, rest, heat, cold..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Current Health Status */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h6 className="mb-0"><i className="bi bi-heart-pulse me-2"></i>Current Health Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Current medications (including over-the-counter)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="currentMedications"
                          value={questionnaire.currentMedications}
                          onChange={handleQuestionnaireChange}
                          placeholder="List all medications, dosages, and frequency..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Known allergies (medications, foods, environmental)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="allergies"
                          value={questionnaire.allergies}
                          onChange={handleQuestionnaireChange}
                          placeholder="List any known allergies and reactions..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Recent illnesses or hospitalizations</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="recentIllnesses"
                          value={questionnaire.recentIllnesses}
                          onChange={handleQuestionnaireChange}
                          placeholder="Any recent health issues or hospital visits..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Family medical history</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="familyHistory"
                          value={questionnaire.familyHistory}
                          onChange={handleQuestionnaireChange}
                          placeholder="Major health conditions in immediate family members..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Lifestyle Factors */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h6 className="mb-0"><i className="bi bi-activity me-2"></i>Lifestyle & Habits</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Smoking status</Form.Label>
                        <Form.Select
                          name="smokingStatus"
                          value={questionnaire.smokingStatus}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="never">Never smoked</option>
                          <option value="former">Former smoker</option>
                          <option value="current">Current smoker</option>
                          <option value="social">Social smoker</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Alcohol consumption</Form.Label>
                        <Form.Select
                          name="alcoholConsumption"
                          value={questionnaire.alcoholConsumption}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="never">Never</option>
                          <option value="rarely">Rarely</option>
                          <option value="social">Social drinking</option>
                          <option value="moderate">Moderate (1-2 daily)</option>
                          <option value="heavy">Heavy (3+ daily)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Exercise frequency</Form.Label>
                        <Form.Select
                          name="exerciseFrequency"
                          value={questionnaire.exerciseFrequency}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="rarely">Rarely/Never</option>
                          <option value="weekly">1-2 times/week</option>
                          <option value="regular">3-4 times/week</option>
                          <option value="daily">Daily</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Sleep hours per night</Form.Label>
                        <Form.Select
                          name="sleepHours"
                          value={questionnaire.sleepHours}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="less_than_5">Less than 5</option>
                          <option value="5-6">5-6 hours</option>
                          <option value="7-8">7-8 hours</option>
                          <option value="more_than_8">More than 8</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Recent Changes */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-secondary text-white">
                  <h6 className="mb-0"><i className="bi bi-graph-up-arrow me-2"></i>Recent Changes</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Appetite changes</Form.Label>
                        <Form.Select
                          name="appetiteChange"
                          value={questionnaire.appetiteChange}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="no_change">No change</option>
                          <option value="increased">Increased appetite</option>
                          <option value="decreased">Decreased appetite</option>
                          <option value="loss">Complete loss of appetite</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Weight changes</Form.Label>
                        <Form.Select
                          name="weightChange"
                          value={questionnaire.weightChange}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="no_change">No change</option>
                          <option value="gained">Weight gain</option>
                          <option value="lost">Weight loss</option>
                          <option value="fluctuating">Fluctuating</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Vaccination status</Form.Label>
                        <Form.Select
                          name="vaccinationStatus"
                          value={questionnaire.vaccinationStatus}
                          onChange={handleQuestionnaireChange}
                        >
                          <option value="up_to_date">Up to date</option>
                          <option value="behind">Behind on vaccines</option>
                          <option value="unsure">Not sure</option>
                          <option value="declined">Declined vaccines</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Recent mood or mental health changes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="moodChanges"
                          value={questionnaire.moodChanges}
                          onChange={handleQuestionnaireChange}
                          placeholder="Any changes in mood, anxiety, depression, stress levels..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Additional Information */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-dark text-white">
                  <h6 className="mb-0"><i className="bi bi-chat-square-dots me-2"></i>Additional Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">When was your last physical exam?</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastPhysicalExam"
                          value={questionnaire.lastPhysicalExam}
                          onChange={handleQuestionnaireChange}
                          placeholder="e.g., 6 months ago, last year..."
                        />
                      </Form.Group>
                    </Col>
                    {selectedPatient?.gender === 'Female' && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Menstrual history (if applicable)</Form.Label>
                          <Form.Control
                            type="text"
                            name="menstrualHistory"
                            value={questionnaire.menstrualHistory}
                            onChange={handleQuestionnaireChange}
                            placeholder="Last period, regularity, pregnancy status..."
                          />
                        </Form.Group>
                      </Col>
                    )}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Any other concerns or symptoms not mentioned above?</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="additionalConcerns"
                          value={questionnaire.additionalConcerns}
                          onChange={handleQuestionnaireChange}
                          placeholder="Please describe any other health concerns, symptoms, or issues..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Questions you'd like to ask your doctor</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="questionsForDoctor"
                          value={questionnaire.questionsForDoctor}
                          onChange={handleQuestionnaireChange}
                          placeholder="Write down any questions you want to remember to ask during your visit..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuestionnaireModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Submitting...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-1"></i>
                  Submit Questionnaire
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
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
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toastVariant === 'success' ? (
                <><i className="bi bi-check-circle text-success me-2"></i>Success</>
              ) : (
                <><i className="bi bi-exclamation-triangle text-warning me-2"></i>Notice</>
              )}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : 'text-dark'}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Patients;