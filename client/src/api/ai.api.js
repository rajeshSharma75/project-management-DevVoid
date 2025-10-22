import axios from './axios';

/**
 * AI API calls
 */

export const aiAPI = {
  // Summarize project tasks
  summarizeProject: async (projectId) => {
    const response = await axios.post(`/ai/summarize/${projectId}`);
    return response.data;
  },

  // Ask AI a question
  askQuestion: async (question, projectId) => {
    const response = await axios.post('/ai/qa', {
      question,
      projectId,
    });
    return response.data;
  },
};
