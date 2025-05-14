import apiClient from "./axiosConfig";

// Learning Plans
export const getAllPlans = async () => {
  try {
    const response = await apiClient.get("/learning-plans");
    return response;
  } catch (error) {
    console.error("Error fetching all plans:", error);
    throw error;
  }
};

export const getPlanById = async (id) => {
  try {
    const response = await apiClient.get(`/learning-plans/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching plan with ID ${id}:`, error);
    throw error;
  }
};

export const getPlansByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/learning-plans/user/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching plans for user ID ${userId}:`, error);
    throw error;
  }
};

export const createPlan = async (planData) => {
  try {
    const response = await apiClient.post("/learning-plans", planData);
    return response;
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

export const updatePlan = async (id, planData) => {
  try {
    const response = await apiClient.put(`/learning-plans/${id}`, planData);
    return response;
  } catch (error) {
    console.error(`Error updating plan with ID ${id}:`, error);
    throw error;
  }
};

export const deletePlan = async (id) => {
  try {
    const response = await apiClient.delete(`/learning-plans/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting plan with ID ${id}:`, error);
    throw error;
  }
};

// Users
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/users", userData);
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
