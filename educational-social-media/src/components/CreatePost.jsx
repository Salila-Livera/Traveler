import React, { useState, useRef } from 'react';
import { FaCode, FaTimes, FaImage, FaVideo } from 'react-icons/fa';
import api from '../services/api';

const CreatePost = ({ refreshPosts }) => {
  const [content, setContent] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [postType, setPostType] = useState('TEXT');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({ content: '', media: '' });
  const [photoCount, setPhotoCount] = useState(0);
  const fileInputRef = useRef(null);
  const MAX_PHOTOS = 3;

  const validateContent = (text) => {
    if (!text.trim()) return 'Content cannot be empty';
    if (/^[0-9\s]+$/.test(text)) return "Post content cannot be only numbers";
    if (!/[a-zA-Z]{3,}/.test(text)) return "Content must contain meaningful words";
    if (text.length < 10) return "Content must be at least 10 characters long";
    return '';
  };

  const validateMedia = async (file) => {
    if (!file) return '';
    
    if (postType === 'PHOTO') {
      if (!file.type.startsWith('image/')) return "Please upload a valid image file";
      if (photoCount >= MAX_PHOTOS) return `You can only upload up to ${MAX_PHOTOS} photos`;
    } 
    else if (postType === 'VIDEO') {
      if (!file.type.startsWith('video/')) return "Please upload a valid video file";
      const duration = await getVideoDuration(file);
      if (duration > 30) return "Video must be 30 seconds or shorter";
    }
    return '';
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const contentError = validateContent(content);
    if (contentError && !mediaFile) {
      setErrors({...errors, content: contentError});
      alert(contentError);
      return;
    }
    
    if (mediaFile) {
      const mediaError = await validateMedia(mediaFile);
      if (mediaError) {
        setErrors({...errors, media: mediaError});
        alert(mediaError);
        return;
      }
    }
    
    try {
      const finalContent = showCodeEditor && code.trim() 
        ? `${content}\n\n\`\`\`${language}\n${code}\n\`\`\`` 
        : content;
      
      const post = {
        user: 'Guest',
        content: finalContent,
        contentUrl: mediaFile ? URL.createObjectURL(mediaFile) : '',
        postType,
        like: 0,
        unlike: 0,
        comments: []
      };
      
      await api.createPost(post);
      if (postType === 'PHOTO') setPhotoCount(prev => prev + 1);
      
      setContent('');
      setCode('');
      setShowCodeEditor(false);
      setShowMediaUpload(false);
      setMediaFile(null);
      setMediaPreview('');
      setPostType('TEXT');
      setErrors({ content: '', media: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      refreshPosts?.();
    } catch (err) {
      alert(err.message || 'Failed to create post');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const error = await validateMedia(file);
    if (error) {
      alert(error);
      return;
    }
    
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMediaSelection = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview('');
    setShowMediaUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const languages = ['javascript', 'python', 'java', 'cpp', 'csharp', 'html', 'css', 'php', 'ruby', 'go', 'typescript'];

  return (
    <div className="card create-post">
      <h3 className="section-title">Create a Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea 
            className={`form-control textarea ${errors.content ? 'is-invalid' : ''}`}
            placeholder="Share educational content, ask questions, or post code snippets..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrors({...errors, content: validateContent(e.target.value)});
            }}
            required={!mediaFile}
          />
          {errors.content && <div className="invalid-feedback">{errors.content}</div>}
        </div>
        
        {showMediaUpload && (
          <div className="media-upload-container">
            <div className="media-upload-header">
              <div className="flex items-center gap-2">
                {postType === 'PHOTO' ? <FaImage /> : <FaVideo />}
                <span>Upload {postType.toLowerCase()}</span>
              </div>
              <button type="button" className="btn-icon" onClick={clearMediaSelection}>
                <FaTimes />
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              accept={postType === 'PHOTO' ? 'image/*' : 'video/*'}
              onChange={handleFileChange}
              className="form-control"
            />
            {mediaPreview && (
              <div className="media-preview">
                {postType === 'PHOTO' ? (
                  <img src={mediaPreview} alt="Preview" className="media-preview-image" />
                ) : (
                  <video controls className="media-preview-video">
                    <source src={mediaPreview} type={mediaFile?.type} />
                  </video>
                )}
              </div>
            )}
            {errors.media && <div className="alert alert-danger mt-2">{errors.media}</div>}
          </div>
        )}
        
        {showCodeEditor && (
          <div className="code-editor-container">
            <div className="code-editor-header">
              <div className="flex items-center gap-2">
                <FaCode />
                <select 
                  className="form-control"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button 
                type="button" 
                className="btn-icon"
                onClick={() => setShowCodeEditor(false)}
              >
                <FaTimes />
              </button>
            </div>
            <textarea 
              className="form-control textarea code-textarea"
              placeholder="// Paste your code here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        )}
        
        <div className="create-post-actions">
          <div className="post-type-actions">
            <button 
              type="button"
              className={`btn ${postType === 'PHOTO' && showMediaUpload ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setPostType('PHOTO');
                setShowMediaUpload(true);
                setShowCodeEditor(false);
              }}
            >
              <FaImage /> Photo
            </button>
            <button 
              type="button"
              className={`btn ${postType === 'VIDEO' && showMediaUpload ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setPostType('VIDEO');
                setShowMediaUpload(true);
                setShowCodeEditor(false);
              }}
            >
              <FaVideo /> Video
            </button>
            <button 
              type="button"
              className={`btn ${showCodeEditor ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setPostType('TEXT');
                setShowCodeEditor(!showCodeEditor);
                setShowMediaUpload(false);
              }}
            >
              <FaCode /> {showCodeEditor ? 'Hide Code' : 'Add Code'}
            </button>
          </div>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={(!content.trim() && !code.trim() && !mediaFile)}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;