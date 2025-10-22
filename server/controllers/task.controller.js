const asyncHandler = require('../utils/asyncHandler');
const { Task, Project } = require('../models');

/**
 * @desc    Get all tasks for a project
 * @route   GET /api/tasks/project/:projectId
 * @access  Private
 */
const getProjectTasks = asyncHandler(async (req, res) => {
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

  // Get all tasks for project
  const tasks = await Task.find({ project: projectId })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ status: 1, order: 1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: {
      tasks,
    },
  });
});

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access to the project
  const project = await Project.findById(task.project._id);
  const hasAccess =
    project.owner.equals(req.user._id) ||
    project.members.some((member) => member.equals(req.user._id));

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this task',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      task,
    },
  });
});

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, status, priority, dueDate, assignedTo } =
    req.body;

  // Check if project exists and user has access
  const projectDoc = await Project.findById(project);

  if (!projectDoc) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  const hasAccess =
    projectDoc.owner.equals(req.user._id) ||
    projectDoc.members.some((member) => member.equals(req.user._id));

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to create task in this project',
    });
  }

  // Get the highest order number for the status
  const highestOrderTask = await Task.findOne({ project, status: status || 'todo' })
    .sort({ order: -1 })
    .limit(1);

  const order = highestOrderTask ? highestOrderTask.order + 1 : 0;

  // Create task
  const task = await Task.create({
    title,
    description,
    project,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate,
    assignedTo,
    createdBy: req.user._id,
    order,
  });

  // Populate fields for response
  await task.populate('assignedTo', 'name email');
  await task.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: {
      task,
    },
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access to the project
  const project = await Project.findById(task.project);
  const hasAccess =
    project.owner.equals(req.user._id) ||
    project.members.some((member) => member.equals(req.user._id));

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task',
    });
  }

  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
    },
    { new: true, runValidators: true }
  )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: {
      task,
    },
  });
});

/**
 * @desc    Move task (change status and order for drag-and-drop)
 * @route   PATCH /api/tasks/:id/move
 * @access  Private
 */
const moveTask = asyncHandler(async (req, res) => {
  const { status, order } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access to the project
  const project = await Project.findById(task.project);
  const hasAccess =
    project.owner.equals(req.user._id) ||
    project.members.some((member) => member.equals(req.user._id));

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to move this task',
    });
  }

  const oldStatus = task.status;
  const oldOrder = task.order;

  // If moving to a different column
  if (status !== oldStatus) {
    // Update orders in old column
    await Task.updateMany(
      { project: task.project, status: oldStatus, order: { $gt: oldOrder } },
      { $inc: { order: -1 } }
    );

    // Update orders in new column
    await Task.updateMany(
      { project: task.project, status: status, order: { $gte: order } },
      { $inc: { order: 1 } }
    );

    task.status = status;
    task.order = order;
  } else {
    // Moving within the same column
    if (order > oldOrder) {
      // Moving down
      await Task.updateMany(
        {
          project: task.project,
          status: status,
          order: { $gt: oldOrder, $lte: order },
        },
        { $inc: { order: -1 } }
      );
    } else if (order < oldOrder) {
      // Moving up
      await Task.updateMany(
        {
          project: task.project,
          status: status,
          order: { $gte: order, $lt: oldOrder },
        },
        { $inc: { order: 1 } }
      );
    }

    task.order = order;
  }

  await task.save();

  // Get updated task with populated fields
  const updatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Task moved successfully',
    data: {
      task: updatedTask,
    },
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access to the project
  const project = await Project.findById(task.project);
  const hasAccess =
    project.owner.equals(req.user._id) ||
    project.members.some((member) => member.equals(req.user._id));

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this task',
    });
  }

  // Update orders of tasks after this one
  await Task.updateMany(
    { project: task.project, status: task.status, order: { $gt: task.order } },
    { $inc: { order: -1 } }
  );

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});

module.exports = {
  getProjectTasks,
  getTask,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
};
