const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { projectSchema } = require('../utils/validators');

const router = express.Router();

// All routes are protected
router.use(protect);

// Project CRUD routes
router.route('/').get(getProjects).post(validate(projectSchema), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(validate(projectSchema), updateProject)
  .delete(deleteProject);

// Member management routes
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
