import axios from './axios';

/**
 * Authentication API calls
 */

export const authAPI = {
  // Register new user
  register: async (name, email, password) => {
    const response = await axios.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Get current user profile
  getMe: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await axios.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};
