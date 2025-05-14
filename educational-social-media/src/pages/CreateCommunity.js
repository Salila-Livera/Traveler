import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import Navbar from '../components/Navbar';

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    topics: [''],
    avatarFile: null,
    avatarPreview: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData(prev => ({ ...prev, topics: newTopics }));
  };

  const addTopic = () => {
    setFormData(prev => ({ ...prev, topics: [...prev.topics, ''] }));
  };

  const removeTopic = (index) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, topics: newTopics }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file)
      }));
    }
  };

  const clearAvatar = () => {
    if (formData.avatarPreview) {
      URL.revokeObjectURL(formData.avatarPreview);
    }
    setFormData(prev => ({
      ...prev,
      avatarFile: null,
      avatarPreview: ''
    }));
  };

 // In CreateCommunity.js
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('isPrivate', formData.isPrivate);
      
      // Add non-empty topics
      formData.topics
        .filter(topic => topic.trim())
        .forEach(topic => formPayload.append('topics', topic));
      
      if (formData.avatarFile) {
        formPayload.append('avatar', formData.avatarFile);
      }
  
      const response = await api.createCommunity(formPayload);
      navigate(`/communities/${response.data.id}`);
    } catch (err) {
      console.error('Error creating community:', err);
      
      // Show more detailed error message if available
      let errorMessage = 'Failed to create community. Please check your inputs and try again.';
      
      if (err.response) {
        if (err.response.data) {
          errorMessage = err.response.data.message || 
                         err.response.data.error || 
                         JSON.stringify(err.response.data);
        } else if (err.response.status === 400) {
          errorMessage = 'Invalid data submitted. Please check all fields and try again.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-community-page">
      <Navbar />
      
      <div className="container">
        <div className="page-header">
          <button 
            className="btn btn-ghost" 
            onClick={() => navigate('/communities')}
          >
            <FaArrowLeft /> Back to Communities
          </button>
          <h1>Create New Community</h1>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Community Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength="50"
              />
              <small className="text-muted">Max 50 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength="500"
              />
              <small className="text-muted">Max 500 characters</small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                />
                <span>Private Community (Requires approval to join)</span>
              </label>
            </div>

            <div className="form-group">
              <label>Topics (Tags)</label>
              <div className="topics-list">
                {formData.topics.map((topic, index) => (
                  <div key={index} className="topic-input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      placeholder="e.g. React, JavaScript, etc."
                    />
                    {formData.topics.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-icon btn-danger"
                        onClick={() => removeTopic(index)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addTopic}
              >
                <FaPlus /> Add Topic
              </button>
            </div>

            <div className="form-group">
              <label>Community Avatar (Optional)</label>
              {formData.avatarPreview ? (
                <div className="avatar-preview-container">
                  <img 
                    src={formData.avatarPreview} 
                    alt="Preview" 
                    className="avatar-preview"
                  />
                  <button
                    type="button"
                    className="btn btn-icon btn-danger"
                    onClick={clearAvatar}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="file-upload">
                  <label htmlFor="avatar" className="file-upload-label">
                    <FaImage /> Choose Image
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-upload-input"
                  />
                </div>
              )}
              <small className="text-muted">Recommended size: 256x256 pixels</small>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Community'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;