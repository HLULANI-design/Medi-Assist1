import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Table, Badge, Alert, Spinner, ProgressBar, Toast, ToastContainer } from 'react-bootstrap';

const MedicationTracker = () => {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      timeSlots: ['08:00'],
      startDate: '2025-09-01',
      endDate: '2025-12-01',
      prescribedBy: 'Dr. Sarah Johnson',
      instructions: 'Take with food. Monitor blood pressure regularly.',
      sideEffects: 'Dizziness, dry cough, fatigue',
      adherence: 85,
      totalPills: 90,
      pillsTaken: 20,
      pillsRemaining: 70,
      lastTaken: '2025-09-24 08:15',
      nextDose: '2025-09-25 08:00',
      reminderEnabled: true,
      category: 'cardiovascular'
    },
    {
      id: 2,
      name: 'Metformin',
      genericName: 'Metformin HCl',
      dosage: '500mg',
      frequency: 'Twice daily',
      timeSlots: ['08:00', '20:00'],
      startDate: '2025-08-15',
      endDate: '2025-11-15',
      prescribedBy: 'Dr. Michael Chen',
      instructions: 'Take with meals to reduce stomach upset.',
      sideEffects: 'Nausea, diarrhea, stomach upset',
      adherence: 92,
      totalPills: 180,
      pillsTaken: 45,
      pillsRemaining: 135,
      lastTaken: '2025-09-24 20:05',
      nextDose: '2025-09-25 08:00',
      reminderEnabled: true,
      category: 'diabetes'
    },
    {
      id: 3,
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      dosage: '1000 IU',
      frequency: 'Once daily',
      timeSlots: ['08:00'],
      startDate: '2025-08-01',
      endDate: '2026-08-01',
      prescribedBy: 'Dr. Emily Rodriguez',
      instructions: 'Take with breakfast for better absorption.',
      sideEffects: 'Generally well tolerated',
      adherence: 78,
      totalPills: 365,
      pillsTaken: 54,
      pillsRemaining: 311,
      lastTaken: '2025-09-23 08:30',
      nextDose: '2025-09-25 08:00',
      reminderEnabled: false,
      category: 'supplement'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [filter, setFilter] = useState('all');

  const [newMedication, setNewMedication] = useState({
    name: '',
    genericName: '',
    dosage: '',
    frequency: 'once_daily',
    timeSlots: [''],
    startDate: '',
    endDate: '',
    prescribedBy: '',
    instructions: '',
    sideEffects: '',
    totalPills: '',
    reminderEnabled: true,
    category: 'other'
  });

  const [medicationLog, setMedicationLog] = useState([
    {
      id: 1,
      medicationId: 1,
      medicationName: 'Lisinopril',
      scheduledTime: '2025-09-24 08:00',
      takenTime: '2025-09-24 08:15',
      status: 'taken',
      notes: ''
    },
    {
      id: 2,
      medicationId: 2,
      medicationName: 'Metformin',
      scheduledTime: '2025-09-24 08:00',
      takenTime: '2025-09-24 08:10',
      status: 'taken',
      notes: ''
    },
    {
      id: 3,
      medicationId: 2,
      medicationName: 'Metformin',
      scheduledTime: '2025-09-24 20:00',
      takenTime: '2025-09-24 20:05',
      status: 'taken',
      notes: ''
    }
  ]);

  const categories = {
    all: 'All Medications',
    cardiovascular: 'Cardiovascular',
    diabetes: 'Diabetes',
    pain: 'Pain Management',
    supplement: 'Supplements',
    antibiotic: 'Antibiotics',
    other: 'Other'
  };

  const frequencyOptions = {
    once_daily: { label: 'Once daily', slots: 1 },
    twice_daily: { label: 'Twice daily', slots: 2 },
    three_times_daily: { label: 'Three times daily', slots: 3 },
    four_times_daily: { label: 'Four times daily', slots: 4 },
    as_needed: { label: 'As needed', slots: 0 }
  };

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return 'success';
    if (adherence >= 75) return 'warning';
    return 'danger';
  };

  const getCategoryColor = (category) => {
    const colors = {
      cardiovascular: 'danger',
      diabetes: 'primary',
      pain: 'warning',
      supplement: 'info',
      antibiotic: 'success',
      other: 'secondary'
    };
    return colors[category] || 'secondary';
  };

  const markMedicationTaken = async (medication, scheduledTime = null) => {
    setLoading(true);
    
    try {
      const currentTime = new Date();
      const logEntry = {
        id: Date.now(),
        medicationId: medication.id,
        medicationName: medication.name,
        scheduledTime: scheduledTime || medication.nextDose,
        takenTime: currentTime.toISOString(),
        status: 'taken',
        notes: ''
      };
      
      // Add to log
      setMedicationLog(prev => [logEntry, ...prev]);
      
      // Update medication stats
      setMedications(prev => prev.map(med => 
        med.id === medication.id 
          ? { 
              ...med, 
              pillsTaken: med.pillsTaken + 1,
              pillsRemaining: med.pillsRemaining - 1,
              lastTaken: currentTime.toISOString(),
              // Calculate next dose time based on frequency
              nextDose: calculateNextDose(med, currentTime),
              adherence: calculateNewAdherence(med)
            }
          : med
      ));
      
      setToastMessage(`✅ ${medication.name} marked as taken!`);
      setToastVariant('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error marking medication taken:', error);
      setToastMessage('Failed to record medication. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextDose = (medication, currentTime) => {
    const frequency = medication.frequency.toLowerCase();
    const nextDose = new Date(currentTime);
    
    if (frequency.includes('once')) {
      nextDose.setDate(nextDose.getDate() + 1);
    } else if (frequency.includes('twice')) {
      nextDose.setHours(nextDose.getHours() + 12);
    } else if (frequency.includes('three')) {
      nextDose.setHours(nextDose.getHours() + 8);
    } else if (frequency.includes('four')) {
      nextDose.setHours(nextDose.getHours() + 6);
    }
    
    return nextDose.toISOString();
  };

  const calculateNewAdherence = (medication) => {
    // Simple adherence calculation - in a real app this would be more sophisticated
    const taken = medication.pillsTaken + 1;
    const expected = Math.ceil((new Date() - new Date(medication.startDate)) / (1000 * 60 * 60 * 24)) * 
                     (medication.timeSlots?.length || 1);
    return Math.min(100, Math.round((taken / expected) * 100));
  };

  const getTodaysDoses = () => {
    const today = new Date().toDateString();
    return medications.flatMap(med => 
      med.timeSlots.map(time => ({
        ...med,
        scheduledTime: `${today} ${time}`,
        timeSlot: time,
        taken: medicationLog.some(log => 
          log.medicationId === med.id && 
          new Date(log.scheduledTime).toDateString() === today &&
          log.scheduledTime.includes(time)
        )
      }))
    ).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  };

  const getUpcomingDoses = () => {
    const now = new Date();
    const todaysDoses = getTodaysDoses();
    return todaysDoses.filter(dose => {
      const doseTime = new Date(`${now.toDateString()} ${dose.timeSlot}`);
      return doseTime > now && !dose.taken;
    }).slice(0, 5);
  };

  const handleAddMedication = async () => {
    setLoading(true);
    
    try {
      const medication = {
        ...newMedication,
        id: Date.now(),
        adherence: 100,
        totalPills: parseInt(newMedication.totalPills),
        pillsTaken: 0,
        pillsRemaining: parseInt(newMedication.totalPills),
        lastTaken: null,
        nextDose: `${newMedication.startDate} ${newMedication.timeSlots[0]}`,
        timeSlots: newMedication.timeSlots.filter(slot => slot.trim() !== '')
      };
      
      setMedications(prev => [...prev, medication]);
      setShowAddModal(false);
      
      // Reset form
      setNewMedication({
        name: '', genericName: '', dosage: '', frequency: 'once_daily', timeSlots: [''],
        startDate: '', endDate: '', prescribedBy: '', instructions: '', sideEffects: '',
        totalPills: '', reminderEnabled: true, category: 'other'
      });
      
      setToastMessage('Medication added successfully!');
      setToastVariant('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error adding medication:', error);
      setToastMessage('Failed to add medication. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedications = medications.filter(med => 
    filter === 'all' || med.category === filter
  );

  // Quick demo function to instantly add a sample medication
  const handleQuickAddDemo = () => {
    const sampleMeds = [
      {
        id: Date.now(),
        name: 'Omega-3',
        genericName: 'Fish Oil',
        dosage: '1000mg',
        frequency: 'Once daily',
        timeSlots: ['09:00'],
        startDate: '2025-09-25',
        endDate: '2025-12-25',
        prescribedBy: 'Dr. Health Pro',
        instructions: 'Take with breakfast for better absorption',
        sideEffects: 'Mild stomach upset if taken on empty stomach',
        adherence: 100,
        totalPills: 90,
        pillsTaken: 0,
        pillsRemaining: 90,
        lastTaken: null,
        nextDose: '2025-09-25 09:00',
        reminderEnabled: true,
        category: 'supplement'
      },
      {
        id: Date.now() + 1,
        name: 'Aspirin',
        genericName: 'Acetylsalicylic Acid',
        dosage: '81mg',
        frequency: 'Once daily',
        timeSlots: ['19:00'],
        startDate: '2025-09-25',
        endDate: '2026-09-25',
        prescribedBy: 'Dr. Heart Care',
        instructions: 'Take with food to prevent stomach irritation',
        sideEffects: 'Stomach upset, increased bleeding risk',
        adherence: 100,
        totalPills: 365,
        pillsTaken: 0,
        pillsRemaining: 365,
        lastTaken: null,
        nextDose: '2025-09-25 19:00',
        reminderEnabled: true,
        category: 'cardiovascular'
      }
    ];
    
    const randomMed = sampleMeds[Math.floor(Math.random() * sampleMeds.length)];
    setMedications(prev => [randomMed, ...prev]);
    setToastMessage(`💊 ${randomMed.name} added to your medications!`);
    setToastVariant('success');
    setShowToast(true);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
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
                <i className="bi bi-capsule text-primary me-2"></i>
                Medication Tracker
              </h2>
              <p className="text-muted mb-0">Track your medications and maintain adherence</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" size="lg" onClick={() => setShowAddModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Add Medication
              </Button>
              <Button variant="success" size="lg" onClick={handleQuickAddDemo}>
                <i className="bi bi-lightning-fill me-2"></i>
                Quick Add
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="text-center">
              <i className="bi bi-capsule display-4 mb-2"></i>
              <h4 className="mb-1">{medications.length}</h4>
              <p className="mb-0">Active Medications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="text-center">
              <i className="bi bi-graph-up display-4 mb-2"></i>
              <h4 className="mb-1">{Math.round(medications.reduce((avg, med) => avg + med.adherence, 0) / medications.length)}%</h4>
              <p className="mb-0">Avg Adherence</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body className="text-center">
              <i className="bi bi-clock display-4 mb-2"></i>
              <h4 className="mb-1">{getUpcomingDoses().length}</h4>
              <p className="mb-0">Upcoming Doses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="text-center">
              <i className="bi bi-check-circle display-4 mb-2"></i>
              <h4 className="mb-1">{medicationLog.filter(log => log.status === 'taken' && 
                new Date(log.takenTime).toDateString() === new Date().toDateString()).length}</h4>
              <p className="mb-0">Taken Today</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Today's Schedule */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-calendar-day me-2"></i>
                Today's Schedule
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {getTodaysDoses().length > 0 ? (
                <div className="list-group list-group-flush">
                  {getTodaysDoses().map((dose, index) => (
                    <div key={`${dose.id}-${dose.timeSlot}`} className={`list-group-item d-flex justify-content-between align-items-center ${dose.taken ? 'bg-light' : ''}`}>
                      <div>
                        <div className="d-flex align-items-center">
                          <div className={`me-3 ${dose.taken ? 'text-success' : 'text-primary'}`}>
                            <i className={`bi bi-${dose.taken ? 'check-circle-fill' : 'clock'}`}></i>
                          </div>
                          <div>
                            <h6 className={`mb-1 ${dose.taken ? 'text-decoration-line-through text-muted' : ''}`}>
                              {dose.name} - {dose.dosage}
                            </h6>
                            <small className="text-muted">{formatTime(dose.timeSlot)}</small>
                          </div>
                        </div>
                      </div>
                      {!dose.taken && (
                        <Button 
                          size="sm" 
                          variant="success" 
                          onClick={() => markMedicationTaken(dose, dose.scheduledTime)}
                          disabled={loading}
                        >
                          <i className="bi bi-check me-1"></i>
                          Take
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted">
                  <i className="bi bi-calendar-x display-4 mb-3"></i>
                  <p>No medications scheduled for today</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Medications List */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-list me-2"></i>
                My Medications
              </h5>
              <Form.Select
                size="sm"
                style={{width: 'auto'}}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white text-dark border-0"
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Form.Select>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Medication</th>
                      <th>Dosage & Frequency</th>
                      <th>Adherence</th>
                      <th>Supply</th>
                      <th>Next Dose</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedications.map(medication => (
                      <tr key={medication.id}>
                        <td>
                          <div>
                            <strong>{medication.name}</strong>
                            <br />
                            <small className="text-muted">{medication.genericName}</small>
                            <br />
                            <Badge bg={getCategoryColor(medication.category)} className="mt-1">
                              {categories[medication.category]}
                            </Badge>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{medication.dosage}</strong>
                            <br />
                            <small className="text-muted">{medication.frequency}</small>
                            <br />
                            <small className="text-primary">
                              {medication.timeSlots.map(formatTime).join(', ')}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <div className={`text-${getAdherenceColor(medication.adherence)} fw-bold mb-1`}>
                              {medication.adherence}%
                            </div>
                            <ProgressBar 
                              variant={getAdherenceColor(medication.adherence)}
                              now={medication.adherence} 
                              style={{height: '6px'}}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <strong>{medication.pillsRemaining}</strong>
                            <br />
                            <small className="text-muted">of {medication.totalPills}</small>
                            {medication.pillsRemaining < 10 && (
                              <>
                                <br />
                                <Badge bg="warning">Low Stock</Badge>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {medication.nextDose ? new Date(medication.nextDose).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => markMedicationTaken(medication)}
                              disabled={loading}
                            >
                              <i className="bi bi-check"></i>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              onClick={() => {
                                setSelectedMedication(medication);
                                setShowDetailsModal(true);
                              }}
                            >
                              <i className="bi bi-info-circle"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {filteredMedications.length === 0 && (
                <div className="p-4 text-center text-muted">
                  <i className="bi bi-capsule display-4 mb-3"></i>
                  <p>No medications found in this category</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Medication Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2 text-primary"></i>
            Add New Medication
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Medication Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Lisinopril"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Generic Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMedication.genericName}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, genericName: e.target.value }))}
                    placeholder="e.g., Lisinopril"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Dosage *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="e.g., 10mg, 500mg"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Frequency *</Form.Label>
                  <Form.Select
                    value={newMedication.frequency}
                    onChange={(e) => {
                      const freq = e.target.value;
                      const slots = frequencyOptions[freq].slots;
                      setNewMedication(prev => ({ 
                        ...prev, 
                        frequency: freq,
                        timeSlots: Array(slots || 1).fill('')
                      }));
                    }}
                    required
                  >
                    {Object.entries(frequencyOptions).map(([key, option]) => (
                      <option key={key} value={key}>{option.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {newMedication.frequency !== 'as_needed' && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Time Slots *</Form.Label>
                {newMedication.timeSlots.map((time, index) => (
                  <Form.Control
                    key={index}
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newSlots = [...newMedication.timeSlots];
                      newSlots[index] = e.target.value;
                      setNewMedication(prev => ({ ...prev, timeSlots: newSlots }));
                    }}
                    className={index > 0 ? 'mt-2' : ''}
                    required
                  />
                ))}
              </Form.Group>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newMedication.endDate}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Prescribed By</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMedication.prescribedBy}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, prescribedBy: e.target.value }))}
                    placeholder="e.g., Dr. Smith"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total Pills</Form.Label>
                  <Form.Control
                    type="number"
                    value={newMedication.totalPills}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, totalPills: e.target.value }))}
                    placeholder="e.g., 30, 90"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select
                value={newMedication.category}
                onChange={(e) => setNewMedication(prev => ({ ...prev, category: e.target.value }))}
              >
                {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newMedication.instructions}
                onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="e.g., Take with food, Monitor blood pressure..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Side Effects</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newMedication.sideEffects}
                onChange={(e) => setNewMedication(prev => ({ ...prev, sideEffects: e.target.value }))}
                placeholder="e.g., Dizziness, nausea, headache..."
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              checked={newMedication.reminderEnabled}
              onChange={(e) => setNewMedication(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
              label="Enable reminders for this medication"
              className="mb-3"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddMedication}
            disabled={loading || !newMedication.name || !newMedication.dosage || !newMedication.startDate}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>
                Add Medication
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Medication Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-info-circle me-2 text-primary"></i>
            {selectedMedication?.name} Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedication && (
            <Row>
              <Col md={6}>
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h6 className="text-primary mb-3">Medication Information</h6>
                    <p><strong>Generic Name:</strong> {selectedMedication.genericName}</p>
                    <p><strong>Dosage:</strong> {selectedMedication.dosage}</p>
                    <p><strong>Frequency:</strong> {selectedMedication.frequency}</p>
                    <p><strong>Prescribed By:</strong> {selectedMedication.prescribedBy}</p>
                    <p><strong>Start Date:</strong> {formatDate(selectedMedication.startDate)}</p>
                    {selectedMedication.endDate && (
                      <p><strong>End Date:</strong> {formatDate(selectedMedication.endDate)}</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h6 className="text-success mb-3">Supply & Adherence</h6>
                    <p><strong>Pills Remaining:</strong> {selectedMedication.pillsRemaining} of {selectedMedication.totalPills}</p>
                    <p><strong>Pills Taken:</strong> {selectedMedication.pillsTaken}</p>
                    <p><strong>Adherence:</strong> 
                      <Badge bg={getAdherenceColor(selectedMedication.adherence)} className="ms-2">
                        {selectedMedication.adherence}%
                      </Badge>
                    </p>
                    <p><strong>Last Taken:</strong> {selectedMedication.lastTaken ? 
                      new Date(selectedMedication.lastTaken).toLocaleString() : 'Never'}</p>
                    <p><strong>Next Dose:</strong> {selectedMedication.nextDose ? 
                      new Date(selectedMedication.nextDose).toLocaleString() : 'N/A'}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12} className="mt-3">
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h6 className="text-warning mb-3">Instructions & Side Effects</h6>
                    <p><strong>Instructions:</strong> {selectedMedication.instructions || 'No specific instructions'}</p>
                    <p><strong>Side Effects:</strong> {selectedMedication.sideEffects || 'No side effects listed'}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
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
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : 'text-dark'}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default MedicationTracker;