import React, { useState } from 'react';
import { FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../services/api';

const CommentSection = ({ postId, comments, refreshPost }) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const [editError, setEditError] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      const comment = {
        user: 'Guest',
        content: newComment
      };
      
      await api.addComment(postId, comment);
      setNewComment('');
      setError('');
      if (refreshPost) refreshPost();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.content || 'Invalid comment');
      } else {
        setError('Failed to add comment');
        console.error('Error adding comment', err);
      }
    }
  };

  const handleEditComment = async (commentId) => {
    if (editingComment === commentId) {
      if (!editContent.trim()) {
        setEditError('Comment cannot be empty');
        return;
      }

      try {
        const updatedComment = {
          user: 'Guest',
          content: editContent
        };
        
        await api.updateComment(postId, commentId, updatedComment);
        setEditingComment(null);
        setEditError('');
        if (refreshPost) refreshPost();
      } catch (err) {
        if (err.response && err.response.data) {
          setEditError(err.response.data.content || 'Invalid comment');
        } else {
          setEditError('Failed to update comment');
          console.error('Error updating comment', err);
        }
      }
    } else {
      const comment = comments.find(c => c.id === commentId);
      setEditContent(comment.content);
      setEditingComment(commentId);
      setEditError('');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteComment(postId, commentId);
      if (refreshPost) refreshPost();
    } catch (err) {
      console.error('Error deleting comment', err);
    }
  };

  return (
    <div className="comments-section">
      <h3 className="section-title">Comments ({comments ? comments.length : 0})</h3>
      
      <div className="add-comment">
        <div className="flex items-center gap-2">
          <div className="avatar">G</div>
          <textarea 
            className={`form-control textarea ${error ? 'border-red-500' : ''}`}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              if (error) setError('');
            }}
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm mt-1">{error}</div>
        )}
        <div className="comment-actions mt-4">
          <button 
            className="btn btn-primary"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </div>
      
      <div className="comments-list">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div className="comment-item" key={comment.id}>
              <div className="comment-header">
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    {comment.user ? comment.user.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="comment-author">{comment.user || 'Unknown'}</h4>
                  </div>
                </div>
                <div className="comment-actions">
                  <button className="btn-icon" onClick={() => handleEditComment(comment.id)}>
                    <FaEdit />
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDeleteComment(comment.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              {editingComment === comment.id ? (
                <div className="form-group">
                  <textarea 
                    className={`form-control textarea ${editError ? 'border-red-500' : ''}`}
                    value={editContent}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      if (editError) setEditError('');
                    }}
                  />
                  {editError && (
                    <div className="text-red-500 text-sm mt-1">{editError}</div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button className="btn btn-primary" onClick={() => handleEditComment(comment.id)}>Save</button>
                    <button className="btn btn-ghost" onClick={() => {
                      setEditingComment(null);
                      setEditError('');
                    }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="comment-content">
                  {comment.content}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-comments">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;