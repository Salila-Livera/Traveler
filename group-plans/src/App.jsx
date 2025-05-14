import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import GroupPlanList from './components/GroupPlanList'
import GroupPlanDetail from './components/GroupPlanDetail'
import GroupPlanForm from './components/GroupPlanForm'
import UserDashboard from './components/UserDashboard'

function App() {
  // Mock user state - in a real app, this would be managed via auth
  const [currentUser] = useState({ id: 1, name: 'Demo User' });
  
  // Effect for animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach(el => {
        const elementPosition = el.getBoundingClientRect().top;
        const screenPosition = window.innerHeight * 0.85;
        if (elementPosition < screenPosition) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header currentUser={currentUser} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plans" element={<GroupPlanList />} />
            <Route path="/plans/:id" element={<GroupPlanDetail currentUser={currentUser} />} />
            <Route path="/create-plan" element={<GroupPlanForm currentUser={currentUser} />} />
            <Route path="/edit-plan/:id" element={<GroupPlanForm currentUser={currentUser} isEditing={true} />} />
            <Route path="/dashboard" element={<UserDashboard currentUser={currentUser} />} />
          </Routes>
        </main>
        <footer className="bg-dark text-white py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-4 mb-md-0">
                <h5 className="text-white mb-3">Group Plans</h5>
                <p className="text-light mb-0">
                  Create and join group plans for trips, events, and activities with friends and like-minded people.
                </p>
              </div>
              <div className="col-md-2 mb-4 mb-md-0">
                <h6 className="text-white mb-3">Quick Links</h6>
                <ul className="list-unstyled">
                  <li className="mb-2"><a href="/" className="text-light text-decoration-none">Home</a></li>
                  <li className="mb-2"><a href="/plans" className="text-light text-decoration-none">Browse Plans</a></li>
                  <li className="mb-2"><a href="/create-plan" className="text-light text-decoration-none">Create Plan</a></li>
                </ul>
              </div>
              <div className="col-md-2 mb-4 mb-md-0">
                <h6 className="text-white mb-3">Support</h6>
                <ul className="list-unstyled">
                  <li className="mb-2"><a href="#" className="text-light text-decoration-none">Help Center</a></li>
                  <li className="mb-2"><a href="#" className="text-light text-decoration-none">Contact Us</a></li>
                  <li className="mb-2"><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h6 className="text-white mb-3">Connect With Us</h6>
                <div className="social-icons mb-3">
                  <a href="#" className="text-light me-3 fs-5"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="text-light me-3 fs-5"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="text-light me-3 fs-5"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="text-light fs-5"><i className="bi bi-linkedin"></i></a>
                </div>
                <p className="text-light mb-0">
                  © {new Date().getFullYear()} Group Plans. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
