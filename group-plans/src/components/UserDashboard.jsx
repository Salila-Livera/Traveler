import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Container, Row, Col, Card, Table, Button, Badge, Tabs, Tab, Spinner, Alert } from 'react-bootstrap';

const UserDashboard = ({ currentUser }) => {
  const [myPlans, setMyPlans] = useState([]);
  const [joinedPlans, setJoinedPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      loadUserPlans();
    }
  }, [currentUser]);

  const loadUserPlans = async () => {
    setLoading(true);
    try {
      // Get plans created by this user
      const createdResponse = await api.getPlansByCreator(currentUser.id);
      setMyPlans(createdResponse.data);

      // Get plans where this user is a participant (but not the creator)
      const participatingResponse = await api.getPlansByParticipant(currentUser.id);
      const participating = participatingResponse.data.filter(
        plan => plan.creatorId !== currentUser.id
      );
      setJoinedPlans(participating);
    } catch (error) {
      console.error('Error loading user plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'secondary';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  };

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please log in to view your dashboard
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">My Dashboard</h1>
      
      <Card className="mb-5 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="my-plans" className="mb-4">
            <Tab eventKey="my-plans" title="Plans I Created">
              {myPlans.length === 0 ? (
                <div className="text-center py-4">
                  <p className="mb-3">You haven't created any plans yet.</p>
                  <Button as={Link} to="/create-plan" variant="primary">
                    <i className="bi bi-plus-circle me-1"></i> Create a New Plan
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Plan Name</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Participants</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myPlans.map(plan => (
                        <tr key={plan.id}>
                          <td>
                            <Link to={`/plans/${plan.id}`} className="text-decoration-none">
                              {plan.name}
                            </Link>
                          </td>
                          <td>{plan.location}</td>
                          <td>{formatDate(plan.startDate)}</td>
                          <td>
                            <Badge bg={getBadgeVariant(plan.status)}>
                              {plan.status}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg="primary" pill>
                              {plan.participantIds?.length || 0} / {plan.maxParticipants}
                            </Badge>
                          </td>
                          <td>
                            <Button 
                              as={Link} 
                              to={`/plans/${plan.id}`} 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                            >
                              View
                            </Button>
                            <Button 
                              as={Link} 
                              to={`/edit-plan/${plan.id}`} 
                              variant="outline-secondary" 
                              size="sm"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Tab>
            
            <Tab eventKey="joined-plans" title="Plans I've Joined">
              {joinedPlans.length === 0 ? (
                <div className="text-center py-4">
                  <p className="mb-3">You haven't joined any plans created by others.</p>
                  <Button as={Link} to="/plans" variant="primary">
                    <i className="bi bi-search me-1"></i> Browse Plans
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Plan Name</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {joinedPlans.map(plan => (
                        <tr key={plan.id}>
                          <td>
                            <Link to={`/plans/${plan.id}`} className="text-decoration-none">
                              {plan.name}
                            </Link>
                          </td>
                          <td>{plan.location}</td>
                          <td>{formatDate(plan.startDate)}</td>
                          <td>
                            <Badge bg={getBadgeVariant(plan.status)}>
                              {plan.status}
                            </Badge>
                          </td>
                          <td>
                            <Button 
                              as={Link} 
                              to={`/plans/${plan.id}`} 
                              variant="outline-primary" 
                              size="sm"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>
                <i className="bi bi-lightning-charge me-2"></i>
                Quick Actions
              </Card.Title>
              <div className="d-grid gap-2 mt-3">
                <Button as={Link} to="/create-plan" variant="primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Plan
                </Button>
                <Button as={Link} to="/plans" variant="outline-primary">
                  <i className="bi bi-search me-2"></i>
                  Browse Available Plans
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100 bg-light">
            <Card.Body className="text-center">
              <Card.Title>Plan Stats</Card.Title>
              <Row className="mt-3">
                <Col>
                  <div className="fs-1 fw-bold text-primary">{myPlans.length}</div>
                  <div>Plans Created</div>
                </Col>
                <Col>
                  <div className="fs-1 fw-bold text-success">{joinedPlans.length}</div>
                  <div>Plans Joined</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
