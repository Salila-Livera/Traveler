import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';


const Header = ({ currentUser }) => {
  return (
    <Navbar bg="white" expand="lg" className="py-3 fixed-top shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="bi bi-calendar-event"></i>
            </div>
            <span className="logo-text text-gradient">Group Plans</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
            <Nav.Link as={Link} to="/plans" className="mx-2">Browse Plans</Nav.Link>
            <Nav.Link as={Link} to="/create-plan" className="mx-2">Create Plan</Nav.Link>
            {currentUser && <Nav.Link as={Link} to="/dashboard" className="mx-2">My Dashboard</Nav.Link>}
          </Nav>
          <Nav>
            {currentUser ? (
              <div className="d-flex align-items-center">
                <div className="user-avatar me-2">
                  <div className="avatar-circle">
                    {currentUser.name.charAt(0)}
                  </div>
                </div>
                <Navbar.Text className="fw-medium">
                  {currentUser.name}
                </Navbar.Text>
              </div>
            ) : (
              <Button variant="primary" className="rounded-pill px-4">Log In</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;