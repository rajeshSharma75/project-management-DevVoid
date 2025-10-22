const express = require('express');
const {
  getProjectTasks,
  getTask,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { taskSchema, taskMoveSchema } = require('../utils/validators');

const router = express.Router();

// All routes are protected
router.use(protect);

// Task CRUD routes
router.post('/', validate(taskSchema), createTask);
router.get('/project/:projectId', getProjectTasks);

router.route('/:id').get(getTask).put(validate(taskSchema), updateTask).delete(deleteTask);

// Task movement for drag-and-drop
router.patch('/:id/move', validate(taskMoveSchema), moveTask);

module.exports = router;
