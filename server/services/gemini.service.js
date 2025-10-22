const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get Gemini model instance
 * @returns {object} Gemini model
 */
const getModel = () => {
  // Use gemini-2.5-flash - stable version that supports generateContent
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

/**
 * Summarize tasks for a project
 * @param {Array} tasks - Array of task objects
 * @returns {Promise<object>} Summarization result
 */
const summarizeTasks = async (tasks) => {
  try {
    if (!tasks || tasks.length === 0) {
      return {
        summary: 'No tasks found in this project.',
        breakdown: {
          todo: 0,
          'in-progress': 0,
          done: 0,
        },
        highlights: ['Project is empty. Start by adding some tasks!'],
      };
    }

    // Prepare task data for AI
    const taskSummary = tasks.map((task) => ({
      title: task.title,
      description: task.description || 'No description',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
      overdue: task.isOverdue || false,
    }));

    // Count tasks by status
    const breakdown = {
      todo: tasks.filter((t) => t.status === 'todo').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };

    // Count overdue tasks
    const overdueCount = tasks.filter((t) => t.isOverdue).length;

    // Count high priority tasks
    const highPriorityCount = tasks.filter(
      (t) => t.priority === 'high' && t.status !== 'done'
    ).length;

    // Create prompt for AI
    const prompt = `You are a project management assistant. Analyze the following tasks and provide a clear, concise summary.

Tasks Data:
${JSON.stringify(taskSummary, null, 2)}

Project Statistics:
- Total Tasks: ${tasks.length}
- To Do: ${breakdown.todo}
- In Progress: ${breakdown['in-progress']}
- Done: ${breakdown.done}
- Overdue Tasks: ${overdueCount}
- High Priority Pending: ${highPriorityCount}

Please provide:
1. A brief overview of the project's current state (2-3 sentences)
2. Key highlights or concerns (3-4 bullet points)
3. Recommended next actions (2-3 items)

Keep the tone professional but friendly. Focus on actionable insights.`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    return {
      summary,
      breakdown,
      statistics: {
        total: tasks.length,
        overdue: overdueCount,
        highPriority: highPriorityCount,
      },
      highlights: extractHighlights(summary),
    };
  } catch (error) {
    console.error('Gemini AI Error:', error);

    // Fallback response if AI fails
    const breakdown = {
      todo: tasks.filter((t) => t.status === 'todo').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };

    return {
      summary: `Your project has ${tasks.length} tasks. ${breakdown.done} completed, ${breakdown['in-progress']} in progress, and ${breakdown.todo} to do.`,
      breakdown,
      highlights: [
        'AI summarization temporarily unavailable',
        'Showing basic statistics instead',
      ],
      error: 'AI service unavailable. Please try again later.',
    };
  }
};

/**
 * Answer questions about tasks using AI
 * @param {string} question - User's question
 * @param {Array} tasks - Array of task objects for context
 * @returns {Promise<object>} Answer result
 */
const answerQuestion = async (question, tasks) => {
  try {
    if (!tasks || tasks.length === 0) {
      return {
        question,
        answer:
          'There are no tasks in this project yet. Please add some tasks first to ask questions about them.',
        relatedTasks: [],
      };
    }

    // Prepare task data for AI context
    const taskContext = tasks.map((task) => ({
      id: task._id,
      title: task.title,
      description: task.description || 'No description',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
      overdue: task.isOverdue || false,
      assignedTo: task.assignedTo?.name || 'Unassigned',
    }));

    // Create prompt for AI
    const prompt = `You are a helpful project management assistant. Answer the user's question about their tasks based on the context provided.

User's Question: "${question}"

Tasks Context:
${JSON.stringify(taskContext, null, 2)}

Instructions:
1. Answer the question directly and concisely
2. Reference specific tasks when relevant
3. If the question can't be answered with the given context, say so politely
4. Keep the response friendly and professional
5. Provide actionable insights when possible

Answer:`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const answer = response.text();

    // Try to identify related tasks (simple keyword matching)
    const relatedTasks = findRelatedTasks(question, tasks);

    return {
      question,
      answer,
      relatedTasks: relatedTasks.slice(0, 5), // Limit to 5 related tasks
    };
  } catch (error) {
    console.error('Gemini AI Error:', error);

    // Fallback response
    return {
      question,
      answer:
        'I apologize, but I am temporarily unable to process your question due to an AI service error. Please try again in a moment, or try rephrasing your question.',
      error: 'AI service unavailable',
      relatedTasks: [],
    };
  }
};

/**
 * Extract highlights from AI summary text
 * @param {string} text - Summary text
 * @returns {Array} Array of highlight strings
 */
const extractHighlights = (text) => {
  const highlights = [];

  // Try to extract bullet points
  const bulletPattern = /[•\-*]\s*(.+)/g;
  let match;

  while ((match = bulletPattern.exec(text)) !== null) {
    highlights.push(match[1].trim());
  }

  // If no bullet points found, split by sentences and take first 3
  if (highlights.length === 0) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    highlights.push(...sentences.slice(0, 3).map((s) => s.trim()));
  }

  return highlights.slice(0, 5); // Limit to 5 highlights
};

/**
 * Find tasks related to the question using simple keyword matching
 * @param {string} question - User's question
 * @param {Array} tasks - Array of tasks
 * @returns {Array} Related tasks
 */
const findRelatedTasks = (question, tasks) => {
  const lowerQuestion = question.toLowerCase();

  // Keywords mapping
  const statusKeywords = {
    todo: ['todo', 'to do', 'pending', 'not started', 'upcoming'],
    'in-progress': ['in progress', 'working on', 'current', 'ongoing'],
    done: ['done', 'completed', 'finished'],
  };

  const priorityKeywords = {
    high: ['high', 'urgent', 'important', 'critical'],
    medium: ['medium', 'normal'],
    low: ['low'],
  };

  const related = [];

  // Check for status-related questions
  for (const [status, keywords] of Object.entries(statusKeywords)) {
    if (keywords.some((kw) => lowerQuestion.includes(kw))) {
      related.push(...tasks.filter((t) => t.status === status));
    }
  }

  // Check for priority-related questions
  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    if (keywords.some((kw) => lowerQuestion.includes(kw))) {
      related.push(...tasks.filter((t) => t.priority === priority));
    }
  }

  // Check for overdue tasks
  if (lowerQuestion.includes('overdue') || lowerQuestion.includes('late')) {
    related.push(...tasks.filter((t) => t.isOverdue));
  }

  // Remove duplicates
  const uniqueRelated = [...new Set(related.map((t) => t._id))].map((id) =>
    tasks.find((t) => t._id.equals(id))
  );

  return uniqueRelated;
};

module.exports = {
  summarizeTasks,
  answerQuestion,
};
