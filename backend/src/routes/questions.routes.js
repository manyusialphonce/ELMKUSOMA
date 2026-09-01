const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const questionsController = require('../controllers/studentQuestions.controller');

router.patch('/:id/approve', authenticate, authorize('TEACHER'), questionsController.approveQuestion);
router.patch('/:id/reject', authenticate, authorize('TEACHER'), questionsController.rejectQuestion);
router.patch('/:id/answer', authenticate, authorize('TEACHER'), questionsController.answerQuestion);

module.exports = router;
