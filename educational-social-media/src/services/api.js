import axios from 'axios';

// Configure axios instance
const instance = axios.create({
  baseURL: 'http://localhost:8080/social/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Handle file uploads and URL creation for development
const handleMediaUpload = async (file) => {
  // In a real application, you would upload the file to a storage service
  // and get back a URL. For this demo, we're using object URLs.
  
  // TODO: Replace with actual file upload API when backend is ready
  
  // For demo purposes only - object URLs will only work in the current session
  const objectUrl = URL.createObjectURL(file);
  
  return {
    url: objectUrl,
    fileType: file.type
  };
};

// Community API endpoints


const api = {

  // Community management
  getAllCommunities: () => instance.get('/communities'),
  getCommunityById: (id) => instance.get(`/communities/${id}`),
  getCommunityByName: (name) => instance.get(`/communities/name/${name}`),
  createCommunity: (formData) => instance.post('/communities', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  updateCommunity: (id, formData) => instance.put(`/communities/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteCommunity: (id) => instance.delete(`/communities/${id}`),
  
  // Membership
  addMemberWithRole: (id, username, role) => 
    instance.post(`/communities/${id}/members/${username}/role`, { role }),
  removeMemberCompletely: (id, username) => 
    instance.delete(`/communities/${id}/members/${username}/complete`),
  
  // Join requests
  getPendingJoinRequests: (id) => instance.get(`/communities/${id}/join-requests/pending`),
  approveJoinRequest: (requestId) => 
    instance.post(`/communities/join-requests/${requestId}/approve`),
  rejectJoinRequest: (requestId) => 
    instance.post(`/communities/join-requests/${requestId}/reject`),
  
  // Posts in communities
  createCommunityPost: (id, post) => instance.post(`/communities/${id}/posts`, post),
  pinCommunityPost: (communityId, postId) => 
    instance.put(`/communities/${communityId}/posts/${postId}/pin`),
  unpinCommunityPost: (communityId, postId) => 
    instance.put(`/communities/${communityId}/posts/${postId}/unpin`),
  getPinnedPosts: (id) => instance.get(`/communities/${id}/posts/pinned`),
  getCommunityPosts: (id) => instance.get(`/communities/${id}/posts`),
  
  // Community roles
  getCommunityModerators: (id) => instance.get(`/communities/${id}/moderators`),
  getTopContributors: (id) => instance.get(`/communities/${id}/top-contributors`),
  
  // Topics
  addTopic: (id, topic) => instance.post(`/communities/${id}/topics?topic=${encodeURIComponent(topic)}`),
  removeTopic: (id, topic) => instance.delete(`/communities/${id}/topics/${encodeURIComponent(topic)}`),
  // Posts
  getAllPosts: () => instance.get('/posts'),
  getPostsByType: (type) => instance.get(`/posts/type/${type}`),
  getPostById: (id) => instance.get(`/post/${id}`),
  
  createPost: async (post) => {
    // If post contains media file, handle upload first
    if (post.mediaFile) {
      const mediaData = await handleMediaUpload(post.mediaFile);
      post.contentUrl = mediaData.url;
      delete post.mediaFile; // Remove the file object before sending to API
    }
    
    return instance.post('/add-post', post);
  },
  
  updatePost: async (id, post) => {
    // Handle media updates if needed
    if (post.mediaFile) {
      const mediaData = await handleMediaUpload(post.mediaFile);
      post.contentUrl = mediaData.url;
      delete post.mediaFile;
    }
    
    return instance.put(`/update-post/${id}`, post);
  },
  
  deletePost: (id) => instance.delete(`/delete-post/${id}`),
  
  // Likes/Unlikes
  likePost: (id, username) => instance.put(`/likes/${id}?username=${username}`),
  unlikePost: (id) => instance.put(`/unlikes/${id}`),
  
  // Comments
  addComment: (postId, comment) => instance.put(`/comment/${postId}`, comment),
  updateComment: (postId, commentId, comment) => 
    instance.put(`/update-comment/${postId}/${commentId}`, comment),
  deleteComment: (postId, commentId) => 
    instance.delete(`/delete-comment/${postId}/${commentId}`),
  
  // Notifications
  getNotifications: (username) => instance.get(`/notifications/${username}`),
  getUnreadNotifications: (username) => instance.get(`/notifications/${username}/unread`),
  markNotificationAsRead: (notificationId) => instance.put(`/notifications/${notificationId}/mark-read`),
  markAllNotificationsAsRead: (username) => instance.put(`/notifications/${username}/mark-all-read`)
};

export default api;