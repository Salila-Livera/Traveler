import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';

const GroupPlanDetail = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadPlanDetails();
  }, [id]);
  
  const loadPlanDetails = async () => {
    try {
      const response = await api.getPlanById(id);
      setPlan(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading plan details:', err);
      setError('Failed to load plan details. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.deletePlan(id);
        navigate('/plans');
      } catch (err) {
        console.error('Error deleting plan:', err);
        alert('Failed to delete plan. Please try again.');
      }
    }
  };
  
  const handleJoin = async () => {
    try {
      await api.addParticipant(id, currentUser.id);
      loadPlanDetails(); // Reload to update participant count
    } catch (err) {
      console.error('Error joining plan:', err);
      alert('Failed to join plan. Please try again.');
    }
  };
  
  const handleLeave = async () => {
    try {
      await api.removeParticipant(id, currentUser.id);
      loadPlanDetails(); // Reload to update participant count
    } catch (err) {
      console.error('Error leaving plan:', err);
      alert('Failed to leave plan. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const isCreator = plan && currentUser && plan.creatorId === currentUser.id;
  const isParticipant = plan && currentUser && plan.participantIds && plan.participantIds.includes(currentUser.id);
  const canJoin = plan && 
                 currentUser && 
                 !isParticipant && 
                 plan.status === 'ACTIVE' && 
                 plan.participantIds.length < plan.maxParticipants;
  
  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
  
  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );
  
  if (!plan) return (
    <Container className="py-5">
      <Alert variant="warning">Plan not found</Alert>
    </Container>
  );
  
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{plan.name}</h1>
        <Badge 
          bg={
            plan.status === 'ACTIVE' ? 'success' :
            plan.status === 'COMPLETED' ? 'secondary' :
            plan.status === 'CANCELLED' ? 'danger' : 'info'
          }
          className="fs-6 py-2 px-3"
        >
          {plan.status}
        </Badge>
      </div>
      
      <Row>
        <Col md={7}>
          <Card className="mb-4 shadow-sm">
            {plan.imageUrl ? (
              <Card.Img 
                src={`http://localhost:8080/uploads/${plan.imageUrl}`} 
                alt={plan.name}
                className="img-fluid"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                <i className="bi bi-image text-secondary" style={{ fontSize: '5rem' }}></i>
              </div>
            )}
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Description</Card.Title>
              <Card.Text>
                {plan.description || 'No description provided.'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={5}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Plan Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={4} className="text-muted">Location</Col>
                <Col xs={8}><strong>{plan.location}</strong></Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={4} className="text-muted">Start Date</Col>
                <Col xs={8}><strong>{formatDate(plan.startDate)}</strong></Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={4} className="text-muted">End Date</Col>
                <Col xs={8}><strong>{formatDate(plan.endDate)}</strong></Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={4} className="text-muted">Budget</Col>
                <Col xs={8}>
                  <strong>
                    {plan.budget ? `$${plan.budget.toFixed(2)}` : 'Not specified'}
                  </strong>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col xs={4} className="text-muted">Participants</Col>
                <Col xs={8}>
                  <Badge bg="primary" className="p-2">
                    <i className="bi bi-people me-1"></i>
                    {plan.participantIds?.length || 0} / {plan.maxParticipants}
                  </Badge>
                </Col>
              </Row>

              <hr />
              
              {isCreator && (
                <div className="d-grid gap-2 mb-3">
                  <Button 
                    as={Link} 
                    to={`/edit-plan/${plan.id}`} 
                    variant="outline-primary"
                  >
                    <i className="bi bi-pencil me-1"></i> Edit Plan
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash me-1"></i> Delete Plan
                  </Button>
                </div>
              )}
              
              {canJoin && (
                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-100 mb-3" 
                  onClick={handleJoin}
                >
                  <i className="bi bi-person-plus me-1"></i> Join Plan
                </Button>
              )}
              
              {isParticipant && !isCreator && (
                <Button 
                  variant="warning" 
                  className="w-100 mb-3" 
                  onClick={handleLeave}
                >
                  <i className="bi bi-person-dash me-1"></i> Leave Plan
                </Button>
              )}
              
              <Button 
                as={Link} 
                to="/plans" 
                variant="outline-secondary" 
                className="w-100"
              >
                <i className="bi bi-arrow-left me-1"></i> Back to Plans
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GroupPlanDetail;