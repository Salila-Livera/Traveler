import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Image } from 'react-bootstrap';

const GroupPlanForm = ({ currentUser, isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: 5,
    budget: '',
    imageUrl: ''
  });
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (isEditing && id) {
      loadGroupPlan();
    }
  }, [isEditing, id]);
  
  const loadGroupPlan = async () => {
    try {
      const response = await api.getPlanById(id);
      const plan = response.data;
      
      // Format dates for input fields
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDThh:mm
      };
      
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        startDate: formatDateForInput(plan.startDate),
        endDate: formatDateForInput(plan.endDate),
        location: plan.location || '',
        maxParticipants: plan.maxParticipants || 5,
        budget: plan.budget || '',
        imageUrl: plan.imageUrl || ''
      });
      
      if (plan.imageUrl) {
        setImagePreview(`http://localhost:8080/uploads/${plan.imageUrl}`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading group plan:', error);
      alert('Failed to load group plan data.');
      navigate('/plans');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload image if a new one is selected
      if (imageFile) {
        const formDataForImage = new FormData();
        formDataForImage.append('file', imageFile);
        const imageResponse = await api.uploadImage(formDataForImage);
        imageUrl = imageResponse.data.imageUrl;
      }
      
      const planData = {
        ...formData,
        imageUrl,
        creatorId: currentUser.id,
        participantIds: isEditing ? undefined : [currentUser.id] // Include creator as participant for new plans
      };
      
      if (isEditing) {
        await api.updatePlan(id, planData);
      } else {
        await api.createPlan(planData);
      }
      
      navigate('/plans');
    } catch (error) {
      console.error('Error saving group plan:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} group plan. Please try again.`);
    }
  };
  
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
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 className="mb-4">{isEditing ? 'Edit Group Plan' : 'Create New Group Plan'}</h1>
          
          <Card className="shadow mb-5">
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="name">
                    <Form.Label>Plan Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter a name for your group plan"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a name for the plan.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your group plan"
                  />
                </Form.Group>
                
                <Row className="mb-3">
                  <Form.Group as={Col} md={6} className="mb-3" controlId="startDate">
                    <Form.Label>Start Date & Time <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select a start date and time.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group as={Col} md={6} className="mb-3" controlId="endDate">
                    <Form.Label>End Date & Time <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select an end date and time.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Where will this take place?"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a location.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row className="mb-3">
                  <Form.Group as={Col} md={6} className="mb-3" controlId="maxParticipants">
                    <Form.Label>Maximum Participants <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      required
                      min={1}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please specify a valid number of participants.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group as={Col} md={6} className="mb-3" controlId="budget">
                    <Form.Label>Budget</Form.Label>
                    <Form.Control
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="Estimated cost"
                      step="0.01"
                      min="0"
                    />
                  </Form.Group>
                </Row>
                
                <Form.Group className="mb-4" controlId="image">
                  <Form.Label>Plan Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Upload an image to represent your plan (optional).
                  </Form.Text>
                  
                  {imagePreview && (
                    <div className="mt-3">
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        fluid 
                        rounded 
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {isEditing ? 'Update Plan' : 'Create Plan'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GroupPlanForm;
