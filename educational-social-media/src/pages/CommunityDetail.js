import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUsers, FaBook, FaStar, FaLock, FaEdit } from 'react-icons/fa';
import api from '../services/api';

const CommunityDetail = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.getCommunityById(id);
        setCommunity(response.data);
        // Replace with actual auth check
        setIsOwner(response.data.ownerUsername === 'currentUser');
        setError(null);
      } catch (err) {
        setError('Failed to load community. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!community) return <div>Community not found</div>;

  return (
    <div className="community-detail">
      <div className="community-header">
        <div className="flex items-center gap-4">
          {community.avatarUrl ? (
            <img 
              src={community.avatarUrl} 
              alt={community.name} 
              className="community-avatar-large"
            />
          ) : (
            <div className="community-avatar-large-default">
              {community.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1>{community.name}</h1>
            <p className="text-muted">Created by {community.ownerUsername}</p>
          </div>
        </div>
        
        {isOwner && (
          <Link 
            to={`/communities/${community.id}/edit`}
            className="btn btn-primary"
          >
            <FaEdit /> Edit Community
          </Link>
        )}
      </div>
      
      <div className="community-content">
        <p>{community.description}</p>
        
        <div className="community-meta">
          <span className="meta-item">
            <FaUsers /> {community.members?.length || 0} members
          </span>
          <span className="meta-item">
            <FaBook /> {community.posts?.length || 0} posts
          </span>
          <span className="meta-item">
            {community.isPrivate ? <FaLock /> : <FaUsers />} 
            {community.isPrivate ? ' Private' : ' Public'}
          </span>
        </div>
        
        <div className="community-topics">
          <h3>Topics</h3>
          {community.topics?.length > 0 ? (
            <div className="topics-list">
              {community.topics.map((topic, index) => (
                <span key={index} className="topic-badge">{topic}</span>
              ))}
            </div>
          ) : (
            <p>No topics added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;