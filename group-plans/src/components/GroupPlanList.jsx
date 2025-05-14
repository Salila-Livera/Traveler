import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Container, Row, Col, Card, Button, Form, ButtonGroup, InputGroup, Spinner, Badge, Dropdown } from 'react-bootstrap';

const GroupPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [locationSearch, setLocationSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const animationRef = useRef(null);

  useEffect(() => {
    loadPlans();

    // Animation observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filter, sortBy]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      let response;
      
      switch (filter) {
        case 'active':
          response = await api.getActivePlans();
          break;
        case 'upcoming':
          response = await api.getUpcomingPlans();
          break;
        case 'available':
          response = await api.getAvailablePlans();
          break;
        case 'location':
          if (locationSearch.trim()) {
            response = await api.getPlansByLocation(locationSearch);
          } else {
            response = await api.getAllPlans();
          }
          break;
        default:
          response = await api.getAllPlans();
      }
      
      let sortedPlans = [...response.data];

      switch (sortBy) {
        case 'date':
          sortedPlans.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          break;
        case 'popularity':
          sortedPlans.sort((a, b) => (b.participantIds?.length || 0) - (a.participantIds?.length || 0));
          break;
        case 'name':
          sortedPlans.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      setPlans(sortedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (locationSearch.trim()) {
      setFilter('location');
      loadPlans();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'secondary';
      case 'CANCELLED': return 'danger';
      default: return 'primary';
    }
  };

  const handleClearSearch = () => {
    setLocationSearch('');
    setFilter('all');
    loadPlans();
  }

  return (
    <Container className="mt-5 pt-5">
      <div className="mb-5 text-center">
        <h1 className="display-5 fw-bold">Discover Group Plans</h1>
        <p className="lead text-muted">Find the perfect group activity or trip that matches your interests</p>
      </div>
      
      <Card className="mb-5 shadow-sm border-0 animate-on-scroll">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <Form onSubmit={handleLocationSearch}>
                <InputGroup className="search-bar mb-3 mb-md-0">
                  <InputGroup.Text className="bg-white border-end-0">
                    <i className="bi bi-geo-alt text-primary"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search plans by location..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="border-start-0 ps-0"
                    aria-label="Search by location"
                  />
                  {locationSearch && (
                    <Button 
                      variant="outline-secondary" 
                      className="border-0"
                      onClick={handleClearSearch}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  )}
                  <Button type="submit" variant="primary">
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-center justify-content-md-end">
                <span className="me-2 text-nowrap">Sort by:</span>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="sort-dropdown">
                    {sortBy === 'date' ? 'Date' : 
                     sortBy === 'popularity' ? 'Popularity' : 'Name'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortBy('date')} active={sortBy === 'date'}>Date</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('popularity')} active={sortBy === 'popularity'}>Popularity</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('name')} active={sortBy === 'name'}>Name</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="filters-container mb-4 animate-on-scroll">
        <h5 className="mb-3">Filter Plans</h5>
        <div className="filter-pills mb-3">
          <ButtonGroup className="flex-wrap">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'} 
              onClick={() => setFilter('all')}
              className="rounded-pill me-2 mb-2"
            >
              All Plans
            </Button>
            <Button 
              variant={filter === 'active' ? 'primary' : 'outline-primary'} 
              onClick={() => setFilter('active')}
              className="rounded-pill me-2 mb-2"
            >
              <i className="bi bi-calendar-check me-1"></i> Active Plans
            </Button>
            <Button 
              variant={filter === 'upcoming' ? 'primary' : 'outline-primary'} 
              onClick={() => setFilter('upcoming')}
              className="rounded-pill me-2 mb-2"
            >
              <i className="bi bi-calendar-date me-1"></i> Upcoming Plans
            </Button>
            <Button 
              variant={filter === 'available' ? 'primary' : 'outline-primary'} 
              onClick={() => setFilter('available')}
              className="rounded-pill me-2 mb-2"
            >
              <i className="bi bi-people me-1"></i> Available to Join
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div ref={animationRef}>
          {plans.length === 0 ? (
            <div className="empty-state text-center py-5 bg-light rounded-4 animate-on-scroll">
              <i className="bi bi-calendar-x fs-1 text-secondary mb-3"></i>
              <h3>No plans found</h3>
              <p className="text-muted mb-4">We couldn't find any plans matching your search criteria.</p>
              <Button as={Link} to="/create-plan" variant="primary">
                Create a New Plan
              </Button>
            </div>
          ) : (
            <Row>
              {plans.map((plan, index) => (
                <Col md={6} lg={4} className="mb-4 animate-on-scroll" key={plan.id}>
                  <Card className="h-100 plan-card border-0">
                    <div className="position-relative">
                      {plan.imageUrl ? (
                        <Card.Img 
                          variant="top" 
                          src={`http://localhost:8080/uploads/${plan.imageUrl}`} 
                          alt={plan.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="placeholder-img bg-light d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                          <i className="bi bi-image text-secondary" style={{fontSize: '3rem'}}></i>
                        </div>
                      )}
                      <Badge 
                        bg={getStatusBadgeVariant(plan.status)} 
                        className="position-absolute top-0 end-0 m-3"
                      >
                        {plan.status}
                      </Badge>
                    </div>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="fs-4">{plan.name}</Card.Title>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-geo-alt me-2 text-primary"></i>
                          <span>{plan.location}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-calendar-range me-2 text-primary"></i>
                          <span>{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-people me-2 text-primary"></i>
                          <div className="participants-bar position-relative me-2">
                            <div className="participants-bar-bg"></div>
                            <div 
                              className="participants-bar-fill" 
                              style={{width: `${Math.min(100, (plan.participantIds?.length || 0) / plan.maxParticipants * 100)}%`}}
                            ></div>
                          </div>
                          <span>{plan.participantIds?.length || 0} / {plan.maxParticipants}</span>
                        </div>
                      </div>
                      
                      <div className="d-grid">
                        <Button 
                          as={Link} 
                          to={`/plans/${plan.id}`} 
                          variant="primary"
                          className="rounded-pill"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
      
      {plans.length > 0 && (
        <div className="text-center mt-4 py-4 animate-on-scroll">
          <Button as={Link} to="/create-plan" variant="outline-primary" className="rounded-pill px-4">
            <i className="bi bi-plus-circle me-2"></i> Create Your Own Plan
          </Button>
        </div>
      )}
    </Container>
  );
};

export default GroupPlanList;
