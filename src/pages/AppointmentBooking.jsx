import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner, InputGroup, Toast, ToastContainer } from 'react-bootstrap';

const AppointmentBooking = () => {
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date/Time, 3: Confirm
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.8,
      experience: 12,
      education: 'MD, Harvard Medical School',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      availableDays: ['monday', 'tuesday', 'wednesday', 'friday'],
      consultationFee: 150,
      nextAvailable: '2025-09-26'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'General Medicine',
      rating: 4.6,
      experience: 8,
      education: 'MD, Johns Hopkins University',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      availableDays: ['monday', 'tuesday', 'thursday', 'friday', 'saturday'],
      consultationFee: 120,
      nextAvailable: '2025-09-25'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      rating: 4.9,
      experience: 15,
      education: 'MD, Stanford Medical School',
      image: 'https://images.unsplash.com/photo-1594824298612-c5a8ad3bc6db?w=150&h=150&fit=crop&crop=face',
      availableDays: ['monday', 'wednesday', 'thursday', 'friday'],
      consultationFee: 140,
      nextAvailable: '2025-09-27'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      rating: 4.7,
      experience: 20,
      education: 'MD, Mayo Clinic College of Medicine',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      availableDays: ['tuesday', 'wednesday', 'thursday', 'saturday'],
      consultationFee: 180,
      nextAvailable: '2025-09-28'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      specialty: 'Dermatology',
      rating: 4.8,
      experience: 10,
      education: 'MD, University of Pennsylvania',
      image: 'https://images.unsplash.com/photo-1614608244339-eb9e2e3a5e4d?w=150&h=150&fit=crop&crop=face',
      availableDays: ['monday', 'tuesday', 'friday', 'saturday'],
      consultationFee: 160,
      nextAvailable: '2025-09-26'
    }
  ]);

  const specialties = ['all', 'Cardiology', 'General Medicine', 'Pediatrics', 'Orthopedics', 'Dermatology'];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const appointmentTypes = [
    { value: 'consultation', label: 'General Consultation', description: 'Regular checkup or consultation' },
    { value: 'follow-up', label: 'Follow-up Visit', description: 'Follow-up from previous appointment' },
    { value: 'emergency', label: 'Urgent Care', description: 'Non-emergency urgent care' },
    { value: 'routine', label: 'Routine Checkup', description: 'Annual physical or routine screening' }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const generateAvailableDates = (doctor) => {
    const dates = [];
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    for (let i = 1; i <= 14; i++) { // Next 2 weeks
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = dayNames[date.getDay()];
      
      if (doctor.availableDays.includes(dayName)) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
    setToastMessage(`🩺 ${doctor.name} selected! Choose your preferred date and time.`);
    setToastVariant('success');
    setShowToast(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setToastMessage(`📅 ${formatDate(date)} selected! Now choose your time slot.`);
    setToastVariant('info');
    setShowToast(true);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setToastMessage(`⏰ ${time} slot reserved! Ready to confirm appointment.`);
    setToastVariant('info');
    setShowToast(true);
  };

  const handleBookAppointment = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const appointmentData = {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        notes: notes,
        status: 'pending',
        patientId: 'current-patient-id',
        consultationFee: selectedDoctor.consultationFee
      };
      
      console.log('Booking appointment:', appointmentData);
      
      // Reset form
      setStep(1);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
      
      setToastMessage('🎉 Appointment booked successfully! You will receive a confirmation email shortly.');
      setToastVariant('success');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      setToastMessage('❌ Failed to book appointment. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
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
                <i className="bi bi-calendar-plus text-primary me-2"></i>
                Book Appointment
              </h2>
              <p className="text-muted mb-0">Find and book appointments with our healthcare professionals</p>
            </div>
            {step > 1 && (
              <Button variant="outline-secondary" onClick={() => setStep(step - 1)}>
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Progress Steps */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center">
              <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${step >= 1 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                   style={{width: '40px', height: '40px'}}>
                1
              </div>
              <span className={`me-4 ${step >= 1 ? 'text-primary fw-bold' : 'text-muted'}`}>Select Doctor</span>
              
              <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${step >= 2 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                   style={{width: '40px', height: '40px'}}>
                2
              </div>
              <span className={`me-4 ${step >= 2 ? 'text-primary fw-bold' : 'text-muted'}`}>Select Date & Time</span>
              
              <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${step >= 3 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                   style={{width: '40px', height: '40px'}}>
                3
              </div>
              <span className={step >= 3 ? 'text-primary fw-bold' : 'text-muted'}>Confirm Booking</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <>
          {/* Filters */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search doctors by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* Doctors Grid */}
          <Row className="g-4">
            {filteredDoctors.map(doctor => (
              <Col lg={6} xl={4} key={doctor.id}>
                <Card className="h-100 border-0 shadow-sm hover-shadow">
                  <Card.Body className="p-4">
                    <div className="text-center mb-3">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="rounded-circle mb-2"
                        style={{width: '80px', height: '80px', objectFit: 'cover'}}
                      />
                      <h5 className="mb-1">{doctor.name}</h5>
                      <p className="text-muted mb-0">{doctor.specialty}</p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Rating:</span>
                        <div>
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          {doctor.rating} ({Math.floor(Math.random() * 100 + 50)} reviews)
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Experience:</span>
                        <span>{doctor.experience} years</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Next Available:</span>
                        <Badge bg="success">{new Date(doctor.nextAvailable).toLocaleDateString()}</Badge>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Consultation Fee:</span>
                        <span className="fw-bold text-primary">${doctor.consultationFee}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted">{doctor.education}</small>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      className="w-100"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <i className="bi bi-calendar-plus me-2"></i>
                      Select Doctor
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {filteredDoctors.length === 0 && (
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No doctors found matching your search criteria.
            </Alert>
          )}
        </>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && selectedDoctor && (
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-calendar-event me-2"></i>
                  Schedule Appointment with {selectedDoctor.name}
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Appointment Type */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Appointment Type</Form.Label>
                  <Row className="g-3">
                    {appointmentTypes.map(type => (
                      <Col md={6} key={type.value}>
                        <Form.Check
                          type="radio"
                          id={`type-${type.value}`}
                          name="appointmentType"
                          value={type.value}
                          checked={appointmentType === type.value}
                          onChange={(e) => setAppointmentType(e.target.value)}
                          label={
                            <div>
                              <strong>{type.label}</strong>
                              <br />
                              <small className="text-muted">{type.description}</small>
                            </div>
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>

                {/* Date Selection */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Select Date</Form.Label>
                  <Row className="g-2">
                    {generateAvailableDates(selectedDoctor).slice(0, 10).map(date => (
                      <Col md={6} lg={4} key={date}>
                        <Form.Check
                          type="radio"
                          id={`date-${date}`}
                          name="appointmentDate"
                          value={date}
                          checked={selectedDate === date}
                          onChange={(e) => handleDateChange(e.target.value)}
                          label={formatDate(date)}
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>

                {/* Time Selection */}
                {selectedDate && (
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Select Time</Form.Label>
                    <Row className="g-2">
                      {timeSlots.map(time => (
                        <Col md={4} lg={3} key={time}>
                          <Button
                            variant={selectedTime === time ? 'primary' : 'outline-primary'}
                            size="sm"
                            className="w-100"
                            onClick={() => handleTimeChange(time)}
                          >
                            {time}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>
                )}

                {/* Additional Notes */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Additional Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific concerns or information you'd like to share with the doctor..."
                  />
                </Form.Group>

                {/* Continue Button */}
                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    <i className="bi bi-arrow-right me-2"></i>
                    Continue to Confirmation
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedDoctor && (
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Confirm Your Appointment
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Alert variant="info" className="mb-4">
                  <i className="bi bi-info-circle me-2"></i>
                  Please review your appointment details before confirming.
                </Alert>

                <Row className="g-4">
                  <Col md={6}>
                    <Card className="bg-light border-0">
                      <Card.Body>
                        <h6 className="text-primary mb-3">
                          <i className="bi bi-person-circle me-2"></i>
                          Doctor Information
                        </h6>
                        <p className="mb-2"><strong>Name:</strong> {selectedDoctor.name}</p>
                        <p className="mb-2"><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                        <p className="mb-2"><strong>Experience:</strong> {selectedDoctor.experience} years</p>
                        <p className="mb-0"><strong>Rating:</strong> <i className="bi bi-star-fill text-warning me-1"></i>{selectedDoctor.rating}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="bg-light border-0">
                      <Card.Body>
                        <h6 className="text-primary mb-3">
                          <i className="bi bi-calendar-event me-2"></i>
                          Appointment Details
                        </h6>
                        <p className="mb-2"><strong>Type:</strong> {appointmentTypes.find(t => t.value === appointmentType)?.label}</p>
                        <p className="mb-2"><strong>Date:</strong> {formatDate(selectedDate)}</p>
                        <p className="mb-2"><strong>Time:</strong> {selectedTime}</p>
                        <p className="mb-0"><strong>Fee:</strong> <span className="text-success fw-bold">${selectedDoctor.consultationFee}</span></p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {notes && (
                  <Card className="bg-light border-0 mt-4">
                    <Card.Body>
                      <h6 className="text-primary mb-2">
                        <i className="bi bi-chat-dots me-2"></i>
                        Additional Notes
                      </h6>
                      <p className="mb-0">{notes}</p>
                    </Card.Body>
                  </Card>
                )}

                <div className="text-center mt-4">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleBookAppointment}
                    disabled={loading}
                    className="px-5"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Confirm & Book Appointment
                      </>
                    )}
                  </Button>
                </div>

                <Alert variant="warning" className="mt-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Cancellation Policy:</strong> You can cancel or reschedule your appointment up to 24 hours before the scheduled time without any charges.
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

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

export default AppointmentBooking;