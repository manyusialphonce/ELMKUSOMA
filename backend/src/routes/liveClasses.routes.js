const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const requireVerified = require('../middleware/requireVerified');
const requireActiveSubscription = require('../middleware/requireActiveSubscription');
const liveClassesController = require('../controllers/liveClasses.controller');
const questionsController = require('../controllers/studentQuestions.controller');
const liveChatController = require('../controllers/liveChat.controller');

// Public listing/detail — matches SRS "Public Navigation: Live Classes"
router.get('/', liveClassesController.listLiveClasses);
router.get('/:id', liveClassesController.getLiveClass);

// Teacher-only: create/start/end (BR-003: teacher role + permission + active subscription)
router.post(
  '/',
  authenticate, authorize('TEACHER'), requireVerified, requireActiveSubscription,
  liveClassesController.createLiveClass
);
router.post('/:id/start', authenticate, authorize('TEACHER'), liveClassesController.startLiveClass);
router.post('/:id/end', authenticate, authorize('TEACHER'), liveClassesController.endLiveClass);

// Student-only: join/leave (BR-004: active subscription required)
router.post(
  '/:id/join',
  authenticate, authorize('STUDENT'), requireActiveSubscription,
  liveClassesController.joinLiveClass
);
router.post('/:id/leave', authenticate, authorize('STUDENT'), liveClassesController.leaveLiveClass);

// Student Questions workflow (SRS 10.8 / BR-005)
router.get('/:liveClassId/questions', authenticate, questionsController.listQuestions);
router.post(
  '/:liveClassId/questions',
  authenticate, authorize('STUDENT'), requireActiveSubscription,
  questionsController.requestQuestion
);

// Free-form live chat (distinct from the structured Q&A above — SRS v1.0)
router.get('/:liveClassId/chat', authenticate, liveChatController.listMessages);
router.post('/:liveClassId/chat', authenticate, liveChatController.postMessage);

module.exports = router;
