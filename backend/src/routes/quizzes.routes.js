const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const requireVerified = require('../middleware/requireVerified');
const requireActiveSubscription = require('../middleware/requireActiveSubscription');
const validate = require('../middleware/validate');
const { createQuizRules, submitAttemptRules } = require('../validators/quizzes.validators');
const quizzesController = require('../controllers/quizzes.controller');

router.get('/', authenticate, quizzesController.listQuizzes);
router.get('/attempts/me', authenticate, authorize('STUDENT'), quizzesController.myAttempts);
router.get('/:id', authenticate, quizzesController.getQuiz);
router.get('/:id/results', authenticate, authorize('TEACHER'), quizzesController.getQuizResults);

router.post(
  '/',
  authenticate, authorize('TEACHER'), requireVerified,
  createQuizRules, validate,
  quizzesController.createQuiz
);

router.post(
  '/:id/attempts',
  authenticate, authorize('STUDENT'), requireActiveSubscription,
  submitAttemptRules, validate,
  quizzesController.submitAttempt
);

module.exports = router;
