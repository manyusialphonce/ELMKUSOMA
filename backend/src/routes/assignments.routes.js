const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const requireVerified = require('../middleware/requireVerified');
const requireActiveSubscription = require('../middleware/requireActiveSubscription');
const assignmentsController = require('../controllers/assignments.controller');

router.get('/', authenticate, assignmentsController.listAssignments);
router.get('/:id', authenticate, assignmentsController.getAssignment);
router.get('/:id/submissions', authenticate, authorize('TEACHER'), assignmentsController.listSubmissions);

router.post(
  '/',
  authenticate, authorize('TEACHER'), requireVerified,
  assignmentsController.createAssignment
);

router.post(
  '/:id/submissions',
  authenticate, authorize('STUDENT'), requireActiveSubscription,
  assignmentsController.submitAssignment
);

module.exports = router;
