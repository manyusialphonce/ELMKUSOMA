const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const requireVerified = require('../middleware/requireVerified');
const nurseryGamesController = require('../controllers/nurseryGames.controller');

router.get('/', nurseryGamesController.listGames); // public listing (metadata only)
router.get('/:id', authenticate, nurseryGamesController.getGame);

router.post(
  '/',
  authenticate, authorize('TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'), requireVerified,
  nurseryGamesController.createGame
);

router.patch(
  '/:id/publish',
  authenticate, authorize('TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'),
  nurseryGamesController.publishGame
);

router.put(
  '/:id/progress',
  authenticate, authorize('STUDENT'),
  nurseryGamesController.saveProgress
);

module.exports = router;
