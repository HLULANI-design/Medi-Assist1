import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert, Badge, Spinner, ProgressBar, Toast, ToastContainer } from 'react-bootstrap';

const PatientQuestionnaire = () => {
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
      questionnaire_completed: false
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  
  const [questionnaire, setQuestionnaire] = useState({
    // Basic Information
    chiefComplaint: '',
    symptomDuration: '',
    symptomSeverity: '1',
    previousTreatments: '',
    
    // Pain Assessment
    painLevel: '0',
    painLocation: '',
    painType: '',
    painTriggers: '',
    painImpact: '',
    
    // Current Health
    currentMedications: '',
    allergies: '',
    recentIllnesses: '',
    familyHistory: '',
    currentSymptoms: '',
    
    // Lifestyle
    smokingStatus: 'never',
    alcoholConsumption: 'never',
    exerciseFrequency: 'rarely',
    sleepHours: '7-8',
    stressLevel: '3',
    dietHabits: '',
    
    // Recent Changes
    appetiteChange: 'no_change',
    weightChange: 'no_change',
    moodChanges: '',
    energyLevel: 'normal',
    
    // Specific Concerns
    specificConcerns: '',
    questionsForDoctor: '',
    additionalInfo: '',
    urgencyLevel: 'routine'
  });

  const sections = [
    {
      title: 'Main Concern',
      icon: 'chat-dots',
      color: 'primary',
      fields: ['chiefComplaint', 'symptomDuration', 'symptomSeverity', 'previousTreatments']
    },
    {
      title: 'Pain Assessment',
      icon: 'bandaid',
      color: 'warning',
      fields: ['painLevel', 'painLocation', 'painType', 'painTriggers', 'painImpact']
    },
    {
      title: 'Current Health',
      icon: 'heart-pulse',
      color: 'success',
      fields: ['currentMedications', 'allergies', 'recentIllnesses', 'familyHistory', 'currentSymptoms']
    },
    {
      title: 'Lifestyle Factors',
      icon: 'activity',
      color: 'info',
      fields: ['smokingStatus', 'alcoholConsumption', 'exerciseFrequency', 'sleepHours', 'stressLevel', 'dietHabits']
    },
    {
      title: 'Recent Changes',
      icon: 'graph-up-arrow',
      color: 'secondary',
      fields: ['appetiteChange', 'weightChange', 'moodChanges', 'energyLevel']
    },
    {
      title: 'Additional Information',
      icon: 'chat-square-dots',
      color: 'dark',
      fields: ['specificConcerns', 'questionsForDoctor', 'additionalInfo', 'urgencyLevel']
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionnaire(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openQuestionnaire = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
    setCurrentSection(0);
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(questionnaire).length;
    const filledFields = Object.values(questionnaire).filter(value => value && value.trim() !== '').length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const getSectionProgress = (section) => {
    const sectionFields = section.fields;
    const filledFields = sectionFields.filter(field => questionnaire[field] && questionnaire[field].trim() !== '').length;
    return Math.round((filledFields / sectionFields.length) * 100);
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const submissionData = {
        appointmentId: selectedAppointment.id,
        patientId: 'current-patient-id',
        questionnaire: questionnaire,
        submittedAt: new Date().toISOString(),
        completionPercentage: calculateProgress()
      };
      
      console.log('Submitting patient questionnaire:', submissionData);
      
      // Update appointment status
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, questionnaire_completed: true }
          : apt
      ));
      
      // Reset form
      setQuestionnaire({
        chiefComplaint: '', symptomDuration: '', symptomSeverity: '1', previousTreatments: '',
        painLevel: '0', painLocation: '', painType: '', painTriggers: '', painImpact: '',
        currentMedications: '', allergies: '', recentIllnesses: '', familyHistory: '', currentSymptoms: '',
        smokingStatus: 'never', alcoholConsumption: 'never', exerciseFrequency: 'rarely', 
        sleepHours: '7-8', stressLevel: '3', dietHabits: '',
        appetiteChange: 'no_change', weightChange: 'no_change', moodChanges: '', energyLevel: 'normal',
        specificConcerns: '', questionsForDoctor: '', additionalInfo: '', urgencyLevel: 'routine'
      });
      
      setShowModal(false);
      setToastMessage('📋 Pre-visit questionnaire submitted successfully! Your doctor will review your responses before the appointment.');
      setToastVariant('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setToastMessage('❌ Failed to submit questionnaire. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const renderSectionContent = (section) => {
    switch (section.title) {
      case 'Main Concern':
        return (
          <div className="space-y-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-primary">
                <i className="bi bi-chat-dots me-2"></i>
                What is the main reason for your upcoming visit? *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="chiefComplaint"
                value={questionnaire.chiefComplaint}
                onChange={handleInputChange}
                placeholder="Please describe your main symptoms, concerns, or the reason for this appointment in detail..."
                required
              />
              <Form.Text className="text-muted">
                Be as specific as possible - this helps your doctor prepare for your visit.
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">How long have you experienced these symptoms?</Form.Label>
                  <Form.Select
                    name="symptomDuration"
                    value={questionnaire.symptomDuration}
                    onChange={handleInputChange}
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
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    Symptom Severity (1-10): <Badge bg="info">{questionnaire.symptomSeverity}</Badge>
                  </Form.Label>
                  <Form.Range
                    name="symptomSeverity"
                    value={questionnaire.symptomSeverity}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
                  <div className="d-flex justify-content-between small text-muted mt-1">
                    <span>1 (Very Mild)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Severe)</span>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label className="fw-bold">Have you tried any treatments for this condition?</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="previousTreatments"
                value={questionnaire.previousTreatments}
                onChange={handleInputChange}
                placeholder="List any medications, home remedies, or treatments you've tried..."
              />
            </Form.Group>
          </div>
        );

      case 'Pain Assessment':
        return (
          <div className="space-y-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    Current Pain Level (0-10): <Badge bg="warning">{questionnaire.painLevel}</Badge>
                  </Form.Label>
                  <Form.Range
                    name="painLevel"
                    value={questionnaire.painLevel}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                  />
                  <div className="d-flex justify-content-between small text-muted mt-1">
                    <span>0 (No pain)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Worst possible)</span>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Where is the pain located?</Form.Label>
                  <Form.Control
                    type="text"
                    name="painLocation"
                    value={questionnaire.painLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., lower back, right knee, chest, head..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">How would you describe the pain?</Form.Label>
                  <Form.Select
                    name="painType"
                    value={questionnaire.painType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select pain type</option>
                    <option value="sharp">Sharp/Stabbing</option>
                    <option value="dull">Dull/Aching</option>
                    <option value="burning">Burning</option>
                    <option value="throbbing">Throbbing/Pulsing</option>
                    <option value="cramping">Cramping</option>
                    <option value="tingling">Tingling/Numbness</option>
                    <option value="shooting">Shooting</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">What triggers or worsens the pain?</Form.Label>
                  <Form.Control
                    type="text"
                    name="painTriggers"
                    value={questionnaire.painTriggers}
                    onChange={handleInputChange}
                    placeholder="e.g., movement, rest, stress, weather..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label className="fw-bold">How does the pain impact your daily activities?</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="painImpact"
                value={questionnaire.painImpact}
                onChange={handleInputChange}
                placeholder="Describe how pain affects work, sleep, exercise, mood, etc..."
              />
            </Form.Group>
          </div>
        );

      case 'Current Health':
        return (
          <div className="space-y-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                <i className="bi bi-capsule me-2"></i>
                Current Medications & Supplements
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="currentMedications"
                value={questionnaire.currentMedications}
                onChange={handleInputChange}
                placeholder="List all medications (prescription and over-the-counter), vitamins, and supplements with dosages..."
              />
              <Form.Text className="text-muted">
                Include dosage amounts and how often you take them.
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Known Allergies</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="allergies"
                    value={questionnaire.allergies}
                    onChange={handleInputChange}
                    placeholder="List medications, foods, environmental allergies and reactions..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Recent Illnesses/Hospitalizations</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="recentIllnesses"
                    value={questionnaire.recentIllnesses}
                    onChange={handleInputChange}
                    placeholder="Any recent health issues, surgeries, or hospital visits..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Family Medical History</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="familyHistory"
                value={questionnaire.familyHistory}
                onChange={handleInputChange}
                placeholder="Major health conditions in immediate family (parents, siblings, grandparents)..."
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="fw-bold">Other Current Symptoms</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="currentSymptoms"
                value={questionnaire.currentSymptoms}
                onChange={handleInputChange}
                placeholder="Any other symptoms you're currently experiencing..."
              />
            </Form.Group>
          </div>
        );

      case 'Lifestyle Factors':
        return (
          <div className="space-y-4">
            <Row>
              <Col md={3}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Smoking Status</Form.Label>
                  <Form.Select
                    name="smokingStatus"
                    value={questionnaire.smokingStatus}
                    onChange={handleInputChange}
                  >
                    <option value="never">Never smoked</option>
                    <option value="former">Former smoker</option>
                    <option value="current">Current smoker</option>
                    <option value="social">Social smoker</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Alcohol Consumption</Form.Label>
                  <Form.Select
                    name="alcoholConsumption"
                    value={questionnaire.alcoholConsumption}
                    onChange={handleInputChange}
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
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Exercise Frequency</Form.Label>
                  <Form.Select
                    name="exerciseFrequency"
                    value={questionnaire.exerciseFrequency}
                    onChange={handleInputChange}
                  >
                    <option value="rarely">Rarely/Never</option>
                    <option value="weekly">1-2 times/week</option>
                    <option value="regular">3-4 times/week</option>
                    <option value="daily">Daily</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Sleep Hours/Night</Form.Label>
                  <Form.Select
                    name="sleepHours"
                    value={questionnaire.sleepHours}
                    onChange={handleInputChange}
                  >
                    <option value="less_than_5">Less than 5</option>
                    <option value="5-6">5-6 hours</option>
                    <option value="7-8">7-8 hours</option>
                    <option value="more_than_8">More than 8</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    Current Stress Level (1-10): <Badge bg="info">{questionnaire.stressLevel}</Badge>
                  </Form.Label>
                  <Form.Range
                    name="stressLevel"
                    value={questionnaire.stressLevel}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
                  <div className="d-flex justify-content-between small text-muted mt-1">
                    <span>1 (Very Low)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Very High)</span>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Diet & Nutrition Habits</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="dietHabits"
                    value={questionnaire.dietHabits}
                    onChange={handleInputChange}
                    placeholder="Describe your typical diet, any restrictions, or nutritional concerns..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        );

      case 'Recent Changes':
        return (
          <div className="space-y-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Recent Appetite Changes</Form.Label>
                  <Form.Select
                    name="appetiteChange"
                    value={questionnaire.appetiteChange}
                    onChange={handleInputChange}
                  >
                    <option value="no_change">No change</option>
                    <option value="increased">Increased appetite</option>
                    <option value="decreased">Decreased appetite</option>
                    <option value="loss">Complete loss of appetite</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Recent Weight Changes</Form.Label>
                  <Form.Select
                    name="weightChange"
                    value={questionnaire.weightChange}
                    onChange={handleInputChange}
                  >
                    <option value="no_change">No change</option>
                    <option value="gained">Weight gain</option>
                    <option value="lost">Weight loss</option>
                    <option value="fluctuating">Fluctuating</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Energy Level</Form.Label>
                  <Form.Select
                    name="energyLevel"
                    value={questionnaire.energyLevel}
                    onChange={handleInputChange}
                  >
                    <option value="very_low">Very low energy</option>
                    <option value="low">Low energy</option>
                    <option value="normal">Normal energy</option>
                    <option value="high">High energy</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Recent Mood Changes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="moodChanges"
                    value={questionnaire.moodChanges}
                    onChange={handleInputChange}
                    placeholder="Any changes in mood, anxiety, depression, or stress..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        );

      case 'Additional Information':
        return (
          <div className="space-y-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                <i className="bi bi-exclamation-circle me-2"></i>
                Specific Concerns for This Visit
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="specificConcerns"
                value={questionnaire.specificConcerns}
                onChange={handleInputChange}
                placeholder="What specific concerns do you want to address during this appointment?"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                <i className="bi bi-question-circle me-2"></i>
                Questions for Your Doctor
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="questionsForDoctor"
                value={questionnaire.questionsForDoctor}
                onChange={handleInputChange}
                placeholder="Write down any questions you want to remember to ask during your visit..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">How urgent is this visit?</Form.Label>
                  <Form.Select
                    name="urgencyLevel"
                    value={questionnaire.urgencyLevel}
                    onChange={handleInputChange}
                  >
                    <option value="routine">Routine/Non-urgent</option>
                    <option value="somewhat_urgent">Somewhat urgent</option>
                    <option value="urgent">Urgent</option>
                    <option value="very_urgent">Very urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Additional Information</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="additionalInfo"
                    value={questionnaire.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Any other information you think is important..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="success">
              <i className="bi bi-check-circle me-2"></i>
              <strong>Great!</strong> You've completed all sections. Your doctor will review this information before your appointment to provide better care.
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="bi bi-clipboard-check text-primary me-2"></i>
                Pre-Visit Questionnaires
              </h2>
              <p className="text-muted mb-0">Complete health questionnaires before your appointments</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Appointments requiring questionnaires */}
      <Row className="g-4">
        {appointments.filter(apt => !apt.questionnaire_completed).map(appointment => (
          <Col lg={6} key={appointment.id}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">
                    <i className="bi bi-calendar-event me-2"></i>
                    Pre-Visit Form Required
                  </h6>
                </div>
                <Badge bg="warning">Pending</Badge>
              </Card.Header>
              <Card.Body>
                <h5 className="mb-2">{appointment.doctor}</h5>
                <p className="text-muted mb-2">{appointment.specialty}</p>
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {new Date(appointment.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {appointment.time}
                  </small>
                </div>
                <Alert variant="info" className="mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  <small>Complete your pre-visit questionnaire to help your doctor prepare for your appointment.</small>
                </Alert>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => openQuestionnaire(appointment)}
                >
                  <i className="bi bi-clipboard-plus me-2"></i>
                  Start Questionnaire
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Completed questionnaires */}
        {appointments.filter(apt => apt.questionnaire_completed).map(appointment => (
          <Col lg={6} key={appointment.id}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">
                    <i className="bi bi-check-circle me-2"></i>
                    Questionnaire Completed
                  </h6>
                </div>
                <Badge bg="success">Completed</Badge>
              </Card.Header>
              <Card.Body>
                <h5 className="mb-2">{appointment.doctor}</h5>
                <p className="text-muted mb-2">{appointment.specialty}</p>
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {new Date(appointment.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {appointment.time}
                  </small>
                </div>
                <Alert variant="success" className="mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  <small>Your questionnaire has been submitted and reviewed by your doctor.</small>
                </Alert>
                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => openQuestionnaire(appointment)}
                >
                  <i className="bi bi-eye me-2"></i>
                  View Responses
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {appointments.filter(apt => !apt.questionnaire_completed).length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No pending questionnaires. All your pre-visit forms are up to date!
        </Alert>
      )}

      {/* Questionnaire Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-clipboard-check me-2 text-primary"></i>
            Pre-Visit Health Questionnaire
            {selectedAppointment && (
              <div className="fs-6 text-muted mt-1">
                For appointment with {selectedAppointment.doctor} on {new Date(selectedAppointment.date).toLocaleDateString()}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-0">
          {/* Progress Bar */}
          <div className="p-4 bg-light border-bottom">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold">Overall Progress</span>
              <Badge bg="primary">{calculateProgress()}% Complete</Badge>
            </div>
            <ProgressBar variant="primary" now={calculateProgress()} />
          </div>

          {/* Section Navigation */}
          <div className="p-4 border-bottom">
            <Row className="g-2">
              {sections.map((section, index) => (
                <Col md={4} key={index}>
                  <Button
                    variant={currentSection === index ? section.color : `outline-${section.color}`}
                    size="sm"
                    className="w-100 d-flex align-items-center justify-content-between"
                    onClick={() => setCurrentSection(index)}
                  >
                    <span>
                      <i className={`bi bi-${section.icon} me-2`}></i>
                      {section.title}
                    </span>
                    <Badge bg="light" text="dark">
                      {getSectionProgress(section)}%
                    </Badge>
                  </Button>
                </Col>
              ))}
            </Row>
          </div>

          {/* Section Content */}
          <div className="p-4">
            <div className="mb-4">
              <h4 className={`text-${sections[currentSection].color} mb-3`}>
                <i className={`bi bi-${sections[currentSection].icon} me-2`}></i>
                {sections[currentSection].title}
              </h4>
              <ProgressBar 
                variant={sections[currentSection].color} 
                now={getSectionProgress(sections[currentSection])} 
                className="mb-3"
                style={{height: '8px'}}
              />
            </div>
            
            {renderSectionContent(sections[currentSection])}
          </div>
        </Modal.Body>
        
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <Button 
              variant="outline-secondary" 
              onClick={prevSection}
              disabled={currentSection === 0}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Previous
            </Button>
          </div>
          
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Save Draft
            </Button>
            
            {currentSection < sections.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={nextSection}
              >
                Next
                <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Submit Questionnaire
                  </>
                )}
              </Button>
            )}
          </div>
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

export default PatientQuestionnaire;