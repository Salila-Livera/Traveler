import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingPlans } from '../services/api';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';

const Home = () => {
  const [featuredPlans, setFeaturedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const stepsRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedPlans = async () => {
      try {
        const response = await getUpcomingPlans();
        setFeaturedPlans(response.data.slice(0, 3)); // Get first 3 upcoming plans
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured plans:', error);
        setLoading(false);
      }
    };

    fetchFeaturedPlans();

    // Animation observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Container className="mt-5 pt-5">
      {/* Hero Section */}
      <div className="hero-section text-center mb-5">
        <Row className="justify-content-center">
          <Col lg={9}>
            <h1 className="display-3 fw-bold mb-4">Plan Your Next Adventure Together</h1>
            <p className="lead mb-5 fs-4">Create and join group plans for trips, events, and activities with friends and like-minded people</p>
            <div className="d-flex justify-content-center gap-3">
              <Button as={Link} to="/plans" variant="light" size="lg" className="rounded-pill fw-medium px-4">
                <i className="bi bi-search me-2"></i>Browse Plans
              </Button>
              <Button as={Link} to="/create-plan" variant="outline-light" size="lg" className="rounded-pill fw-medium px-4">
                <i className="bi bi-plus-circle me-2"></i>Create a Plan
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Featured Plans Section */}
      <section className="mb-5">
        <h2 className="section-title text-center mb-5">Featured Upcoming Plans</h2>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Row>
            {featuredPlans.length > 0 ? (
              featuredPlans.map((plan, index) => (
                <Col md={4} className="mb-4 animate-on-scroll" style={{animationDelay: `${index * 0.2}s`}} key={plan.id}>
                  <Card className="h-100 border-0 shadow">
                    <div className="position-relative">
                      {plan.imageUrl ? (
                        <Card.Img 
                          variant="top" 
                          src={`http://localhost:8080/uploads/${plan.imageUrl}`} 
                          alt={plan.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                          <i className="bi bi-image text-secondary" style={{fontSize: '3rem'}}></i>
                        </div>
                      )}
                      <div className="plan-date position-absolute bottom-0 end-0 bg-primary text-white px-3 py-2 m-3 rounded-pill">
                        {new Date(plan.startDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <Card.Title className="fs-4 mb-3">{plan.name}</Card.Title>
                      <Card.Text className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-geo-alt me-2 text-primary"></i>
                          <span>{plan.location}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-people me-2 text-primary"></i>
                          <span>{plan.participantIds?.length || 0} / {plan.maxParticipants} participants</span>
                        </div>
                      </Card.Text>
                      <Button as={Link} to={`/plans/${plan.id}`} variant="primary" className="w-100">View Details</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <div className="empty-state">
                  <i className="bi bi-calendar-x fs-1 text-secondary"></i>
                  <p className="mt-3">No upcoming plans available.</p>
                  <Button as={Link} to="/create-plan" variant="primary" className="mt-3">
                    Create the First Plan
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        )}
        
        {featuredPlans.length > 0 && (
          <div className="text-center mt-4">
            <Button as={Link} to="/plans" variant="outline-primary" className="rounded-pill px-4">
              See All Plans<i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="py-5 mb-5 bg-white shadow-sm rounded-4">
        <Container>
          <h2 className="section-title text-center mb-5">How It Works</h2>
          <Row className="g-4" ref={stepsRef}>
            <Col md={3} className="text-center animate-on-scroll">
              <div className="icon-wrapper mb-4">
                <i className="bi bi-search fs-1 text-primary"></i>
              </div>
              <h3 className="fs-4">Find</h3>
              <p className="text-muted">Browse through active group plans or search by location and interests.</p>
            </Col>
            <Col md={3} className="text-center animate-on-scroll">
              <div className="icon-wrapper mb-4">
                <i className="bi bi-pencil-square fs-1 text-primary"></i>
              </div>
              <h3 className="fs-4">Create</h3>
              <p className="text-muted">Have an idea? Create your own group plan and invite others to join.</p>
            </Col>
            <Col md={3} className="text-center animate-on-scroll">
              <div className="icon-wrapper mb-4">
                <i className="bi bi-hand-thumbs-up fs-1 text-primary"></i>
              </div>
              <h3 className="fs-4">Join</h3>
              <p className="text-muted">Join existing plans that match your interests and connect with participants.</p>
            </Col>
            <Col md={3} className="text-center animate-on-scroll">
              <div className="icon-wrapper mb-4">
                <i className="bi bi-star fs-1 text-primary"></i>
              </div>
              <h3 className="fs-4">Enjoy</h3>
              <p className="text-muted">Experience amazing activities and build new connections with your group.</p>
            </Col>
          </Row>
          
          <div className="text-center mt-5 pt-3">
            <Button as={Link} to="/create-plan" variant="primary" size="lg" className="rounded-pill px-5 animate-on-scroll">
              Start Planning Now
            </Button>
          </div>
        </Container>
      </section>
      
      {/* Testimonial/CTA Section */}
      <section className="py-5 text-center mb-5 animate-on-scroll">
        <div className="cta-box bg-gradient p-5 rounded-4 shadow">
          <h2 className="text-white mb-4">Ready to Turn Your Ideas Into Unforgettable Experiences?</h2>
          <p className="lead text-white mb-5">Join our community of adventure seekers and create memories that last a lifetime.</p>
          <Button as={Link} to="/plans" variant="light" size="lg" className="rounded-pill px-5 fw-medium">
            Explore All Plans
          </Button>
        </div>
      </section>
    </Container>
  );
};

export default Home;
