import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaBook, FaStar, FaLock, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const CommunityCard = ({ community, isOwner, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card community-card">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="btn btn-ghost back-button"
      >
        <FaArrowLeft /> Back to Home
      </button>

      <div className="community-header">
        <div className="flex items-center gap-3">
          {community.avatarUrl ? (
            <img 
              src={community.avatarUrl} 
              alt={community.name} 
              className="community-avatar"
            />
          ) : (
            <div className="community-avatar-default">
              {community.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="community-name">{community.name}</h3>
            <p className="text-sm text-muted">Created by {community.ownerUsername}</p>
          </div>
        </div>
        <div className="community-badge">
          {community.isPrivate ? <FaLock /> : <FaUsers />}
        </div>
      </div>
      
      <p className="community-description">{community.description}</p>
      
      <div className="community-stats">
        <div className="stat-item">
          <FaUsers className="stat-icon" />
          <span>{community.members?.length || 0} members</span>
        </div>
        <div className="stat-item">
          <FaBook className="stat-icon" />
          <span>{community.posts?.length || 0} posts</span>
        </div>
      </div>
      
      <div className="community-topics">
        {community.topics?.slice(0, 3).map((topic, index) => (
          <span key={index} className="topic-badge">{topic}</span>
        ))}
        {community.topics?.length > 3 && (
          <span className="topic-badge">+{community.topics.length - 3} more</span>
        )}
      </div>
      
      <div className="community-actions">
        <Link 
          to={`/communities/${community.id}`} 
          className="btn btn-primary btn-block"
        >
          View Community
        </Link>
        
        {isOwner && (
          <>
            <Link 
              to={`/communities/${community.id}/edit`}
              className="btn btn-secondary btn-block"
            >
              <FaEdit /> Edit
            </Link>
            <button 
              className="btn btn-danger btn-block"
              onClick={() => onDelete(community.id)}
            >
              <FaTrash /> Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityCard;