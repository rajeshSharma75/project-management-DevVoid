const asyncHandler = require('../utils/asyncHandler');
const { Project, Task } = require('../models');
const { summarizeTasks, answerQuestion } = require('../services/gemini.service');

/**
 * @desc    Summarize all tasks in a project using Gemini AI
 * @route   POST /api/ai/summarize/:projectId
 * @access  Private
 */
const summarizeProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Check if project exists and user has access
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Check access
  const hasAccess =
    project.owner.equals(req.user._id) ||
    project.members.some((member) => member.equals(req.user._id));

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this project',
    });
  }

  // Get all tasks for the project
  const tasks = await Task.find({ project: projectId })
    .populate('assignedTo', 'name email')
    .sort({ status: 1, order: 1 });

  // Get AI summary
  const result = await summarizeTasks(tasks);

  res.status(200).json({
    success: true,
    message: 'Project summary generated successfully',
    data: {
      projectName: project.name,
      ...result,
    },
  });
});

/**
 * @desc    Ask AI a question about project tasks
 * @route   POST /api/ai/qa
 * @access  Private
 */
const askQuestion = asyncHandler(async (req, res) => {
  const { question, projectId } = req.body;

  if (!question) {
    return res.status(400).json({
      success: false,
      message: 'Question is required',
    });
  }

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: 'Project ID is required',
    });
  }

  // Check if project exists and user has access
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Check access
  const hasAccess =
    project.owner.equals(req.user._id) ||
    project.members.some((member) => member.equals(req.user._id));

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this project',
    });
  }

  // Get all tasks for context
  const tasks = await Task.find({ project: projectId })
    .populate('assignedTo', 'name email')
    .sort({ status: 1, order: 1 });

  // Get AI answer
  const result = await answerQuestion(question, tasks);

  res.status(200).json({
    success: true,
    message: 'Question answered successfully',
    data: {
      projectName: project.name,
      ...result,
    },
  });
});

module.exports = {
  summarizeProject,
  askQuestion,
};
