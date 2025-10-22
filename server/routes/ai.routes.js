const express = require('express');
const { summarizeProject, askQuestion } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { qaSchema } = require('../utils/validators');

const router = express.Router();

// All routes are protected
router.use(protect);

// AI routes
router.post('/summarize/:projectId', summarizeProject);
router.post('/qa', validate(qaSchema), askQuestion);

module.exports = router;
