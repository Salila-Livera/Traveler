import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Export directly as a module
const api = {
  // Group Plans
  getAllPlans: () => axios.get(`${API_BASE_URL}/group-plans`),
  getPlanById: (id) => axios.get(`${API_BASE_URL}/group-plans/${id}`),
  createPlan: (planData) => axios.post(`${API_BASE_URL}/group-plans`, planData),
  updatePlan: (id, planData) => axios.put(`${API_BASE_URL}/group-plans/${id}`, planData),
  deletePlan: (id) => axios.delete(`${API_BASE_URL}/group-plans/${id}`),
  
  // Filtered plans
  getActivePlans: () => axios.get(`${API_BASE_URL}/group-plans/active`),
  getUpcomingPlans: () => axios.get(`${API_BASE_URL}/group-plans/upcoming`),
  getAvailablePlans: () => axios.get(`${API_BASE_URL}/group-plans/available`),
  getPlansByLocation: (location) => axios.get(`${API_BASE_URL}/group-plans/location?location=${location}`),
  getPlansByCreator: (creatorId) => axios.get(`${API_BASE_URL}/group-plans/creator/${creatorId}`),
  getPlansByParticipant: (participantId) => axios.get(`${API_BASE_URL}/group-plans/participant/${participantId}`),
  
  // Participants
  addParticipant: (planId, participantId) => axios.post(`${API_BASE_URL}/group-plans/${planId}/participants/${participantId}`),
  removeParticipant: (planId, participantId) => axios.delete(`${API_BASE_URL}/group-plans/${planId}/participants/${participantId}`),
  
  // Images
  uploadImage: (formData) => axios.post(`${API_BASE_URL}/group-plans/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Plan status
  updatePlanStatus: (id, status) => axios.patch(`${API_BASE_URL}/group-plans/${id}/status?status=${status}`)
};

// Make sure to export as the default
export default api;

// Also export individual functions for components that prefer named imports
export const {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getActivePlans,
  getUpcomingPlans,
  getAvailablePlans,
  getPlansByLocation,
  getPlansByCreator,
  getPlansByParticipant,
  addParticipant,
  removeParticipant,
  uploadImage,
  updatePlanStatus
} = api;
