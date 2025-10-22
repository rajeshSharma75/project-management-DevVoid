const asyncHandler = require('../utils/asyncHandler');
const { Project } = require('../models');

/**
 * @desc    Get all projects for current user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = asyncHandler(async (req, res) => {
  // Find projects where user is owner or member
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: {
      projects,
    },
  });
});

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Check if user has access to project
  const hasAccess =
    project.owner._id.equals(req.user._id) ||
    project.members.some((member) => member._id.equals(req.user._id));

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this project',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      project,
    },
  });
});

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    members: [req.user._id], // Owner is automatically a member
  });

  // Populate fields for response
  await project.populate('owner', 'name email');
  await project.populate('members', 'name email');

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: {
      project,
    },
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Only owner can update project
  if (!project.owner.equals(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Only project owner can update the project',
    });
  }

  const { name, description } = req.body;

  project = await Project.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  )
    .populate('owner', 'name email')
    .populate('members', 'name email');

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: {
      project,
    },
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Only owner can delete project
  if (!project.owner.equals(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Only project owner can delete the project',
    });
  }

  // This will trigger the pre-deleteOne hook to cascade delete tasks
  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project and associated tasks deleted successfully',
  });
});

/**
 * @desc    Add member to project
 * @route   POST /api/projects/:id/members
 * @access  Private
 */
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required',
    });
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Only owner can add members
  if (!project.owner.equals(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Only project owner can add members',
    });
  }

  // Check if user is already a member
  if (project.members.some((member) => member.equals(userId))) {
    return res.status(400).json({
      success: false,
      message: 'User is already a member of this project',
    });
  }

  // Add member
  project.members.push(userId);
  await project.save();

  await project.populate('owner', 'name email');
  await project.populate('members', 'name email');

  res.status(200).json({
    success: true,
    message: 'Member added successfully',
    data: {
      project,
    },
  });
});

/**
 * @desc    Remove member from project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private
 */
const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Only owner can remove members
  if (!project.owner.equals(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Only project owner can remove members',
    });
  }

  // Cannot remove owner
  if (project.owner.equals(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot remove project owner',
    });
  }

  // Remove member
  project.members = project.members.filter((member) => !member.equals(userId));
  await project.save();

  await project.populate('owner', 'name email');
  await project.populate('members', 'name email');

  res.status(200).json({
    success: true,
    message: 'Member removed successfully',
    data: {
      project,
    },
  });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
