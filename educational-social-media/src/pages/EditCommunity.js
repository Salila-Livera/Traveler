import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTrash, FaArrowLeft, FaImage, FaTimes, FaPlus } from 'react-icons/fa';
import api from '../services/api';

const EditCommunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    topics: [''],
    avatarFile: null,
    avatarPreview: '',
    existingAvatar: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.getCommunityById(id);
        const community = response.data;
        setFormData({
          name: community.name,
          description: community.description,
          isPrivate: community.isPrivate,
          topics: community.topics.length > 0 ? community.topics : [''],
          avatarFile: null,
          avatarPreview: '',
          existingAvatar: community.avatarUrl || ''
        });
      } catch (err) {
        setError('Failed to load community. Please try again.');
        console.error('Fetch community error:', err);
      }
    };

    fetchCommunity();
  }, [id]);

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
        avatarPreview: URL.createObjectURL(file),
        existingAvatar: ''
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
      avatarPreview: '',
      existingAvatar: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!formData.name.trim()) {
      setError('Community name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name.trim());
      formPayload.append('description', formData.description.trim());
      formPayload.append('isPrivate', formData.isPrivate);
      
      // Filter out empty topics and append each one
      const validTopics = formData.topics.filter(topic => topic.trim());
      validTopics.forEach(topic => formPayload.append('topics', topic.trim()));
      
      if (formData.avatarFile) {
        formPayload.append('avatar', formData.avatarFile);
      } else if (!formData.existingAvatar) {
        // If no existing avatar and no new file, explicitly clear the avatar
        formPayload.append('avatar', '');
      }

      // Log FormData contents for debugging
      for (let [key, value] of formPayload.entries()) {
        console.log(key, value);
      }

      await api.updateCommunity(id, formPayload);
      navigate(`/communities/${id}`);
    } catch (err) {
      console.error('Error updating community:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message ||
                         'Failed to update community. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      try {
        await api.deleteCommunity(id);
        navigate('/communities');
      } catch (err) {
        console.error('Error deleting community:', err);
        setError(err.response?.data?.message || 'Failed to delete community. Please try again.');
      }
    }
  };

  return (
    <div className="edit-community-page">
      <div className="container">
        <div className="page-header">
          <button 
            className="btn btn-ghost" 
            onClick={() => navigate(`/communities/${id}`)}
            disabled={isSubmitting}
          >
            <FaArrowLeft /> Back to Community
          </button>
          <h1>Edit Community</h1>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Community Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength="50"
                disabled={isSubmitting}
              />
              <small className="text-muted">Max 50 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength="500"
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                    {formData.topics.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-icon btn-danger"
                        onClick={() => removeTopic(index)}
                        disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <FaPlus /> Add Topic
              </button>
            </div>

            <div className="form-group">
              <label>Community Avatar</label>
              {(formData.avatarPreview || formData.existingAvatar) ? (
                <div className="avatar-edit-container">
                  <img 
                    src={formData.avatarPreview || formData.existingAvatar} 
                    alt="Preview" 
                    className="avatar-edit-preview"
                  />
                  <div className="avatar-edit-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={clearAvatar}
                      disabled={isSubmitting}
                    >
                      <FaTimes /> Remove
                    </button>
                    <label className="btn btn-primary" style={{ marginLeft: '8px' }}>
                      <FaImage /> Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
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
                    disabled={isSubmitting}
                  />
                </div>
              )}
              <small className="text-muted">Recommended size: 256x256 pixels</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <FaTrash /> Delete Community
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <FaSave />
                )}
                {isSubmitting ? ' Saving...' : ' Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCommunity;