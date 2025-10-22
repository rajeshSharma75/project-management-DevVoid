import axios from './axios';

/**
 * Task API calls
 */

export const taskAPI = {
  // Get all tasks for a project
  getProjectTasks: async (projectId) => {
    const response = await axios.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await axios.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (data) => {
    const response = await axios.post('/tasks', data);
    return response.data;
  },

  // Update task
  updateTask: async (id, data) => {
    const response = await axios.put(`/tasks/${id}`, data);
    return response.data;
  },

  // Move task (drag and drop)
  moveTask: async (id, status, order) => {
    const response = await axios.patch(`/tasks/${id}/move`, {
      status,
      order,
    });
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await axios.delete(`/tasks/${id}`);
    return response.data;
  },
};
