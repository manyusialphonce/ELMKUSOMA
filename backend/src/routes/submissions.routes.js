const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const assignmentsController = require('../controllers/assignments.controller');

router.patch('/:id/grade', authenticate, authorize('TEACHER'), assignmentsController.gradeSubmission);

module.exports = router;
