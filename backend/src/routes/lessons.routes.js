const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const requireVerified = require('../middleware/requireVerified');
const requireActiveSubscription = require('../middleware/requireActiveSubscription');
const lessonsController = require('../controllers/lessons.controller');

router.get('/', lessonsController.listLessons); // public listing (metadata only)
router.get('/progress/me', authenticate, authorize('STUDENT'), lessonsController.myProgress);
router.get('/:id', authenticate, requireActiveSubscription, lessonsController.getLesson);

router.post(
  '/',
  authenticate, authorize('TEACHER'), requireVerified,
  lessonsController.createLesson
);

router.patch(
  '/:id/publish',
  authenticate, authorize('TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'),
  lessonsController.publishLesson
);

router.put(
  '/:id/progress',
  authenticate, authorize('STUDENT'), requireActiveSubscription,
  lessonsController.saveProgress
);

module.exports = router;
