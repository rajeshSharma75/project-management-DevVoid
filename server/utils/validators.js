const Joi = require('joi');

/**
 * Validation schemas using Joi
 */

// User registration validation
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Project creation/update validation
const projectSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    'string.empty': 'Project name is required',
    'string.min': 'Project name must be at least 2 characters',
    'string.max': 'Project name cannot exceed 100 characters',
  }),
  description: Joi.string().max(500).trim().allow('').optional(),
});

// Task creation/update validation
const taskSchema = Joi.object({
  title: Joi.string().min(2).max(200).trim().required().messages({
    'string.empty': 'Task title is required',
    'string.min': 'Task title must be at least 2 characters',
    'string.max': 'Task title cannot exceed 200 characters',
  }),
  description: Joi.string().max(1000).trim().allow('').optional(),
  project: Joi.string().required().messages({
    'string.empty': 'Project ID is required',
  }),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().optional().allow(null),
  assignedTo: Joi.string().optional().allow(null),
});

// Task move validation (for drag-and-drop)
const taskMoveSchema = Joi.object({
  status: Joi.string().valid('todo', 'in-progress', 'done').required(),
  order: Joi.number().integer().min(0).required(),
});

// AI Q&A validation
const qaSchema = Joi.object({
  question: Joi.string().min(5).max(500).trim().required().messages({
    'string.empty': 'Question is required',
    'string.min': 'Question must be at least 5 characters',
    'string.max': 'Question cannot exceed 500 characters',
  }),
  projectId: Joi.string().required().messages({
    'string.empty': 'Project ID is required',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  projectSchema,
  taskSchema,
  taskMoveSchema,
  qaSchema,
};
