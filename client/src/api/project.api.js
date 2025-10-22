import axios from './axios';

/**
 * Project API calls
 */

export const projectAPI = {
  // Get all projects
  getProjects: async () => {
    const response = await axios.get('/projects');
    return response.data;
  },

  // Get single project
  getProject: async (id) => {
    const response = await axios.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (data) => {
    const response = await axios.post('/projects', data);
    return response.data;
  },

  // Update project
  updateProject: async (id, data) => {
    const response = await axios.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await axios.delete(`/projects/${id}`);
    return response.data;
  },

  // Add member to project
  addMember: async (id, userId) => {
    const response = await axios.post(`/projects/${id}/members`, { userId });
    return response.data;
  },

  // Remove member from project
  removeMember: async (id, userId) => {
    const response = await axios.delete(`/projects/${id}/members/${userId}`);
    return response.data;
  },
};
