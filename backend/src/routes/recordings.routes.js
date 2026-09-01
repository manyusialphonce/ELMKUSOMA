const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const requireVerified = require('../middleware/requireVerified');
const requireActiveSubscription = require('../middleware/requireActiveSubscription');
const recordingsController = require('../controllers/recordings.controller');

router.get('/', recordingsController.listRecordings); // public listing (metadata only, no stream URL)

router.get('/mine', authenticate, authorize('TEACHER'), recordingsController.myRecordings);

router.get(
  '/:id',
  authenticate, requireActiveSubscription,
  recordingsController.getRecording
);

router.post(
  '/',
  authenticate, authorize('TEACHER'), requireVerified,
  recordingsController.createRecording
);

router.patch('/:id/publish', authenticate, authorize('TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'), recordingsController.publishRecording);

module.exports = router;
