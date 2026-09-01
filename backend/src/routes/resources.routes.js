const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const requireVerified = require('../middleware/requireVerified');
const resourcesController = require('../controllers/resources.controller');

router.get('/', resourcesController.listResources); // public listing (metadata only)
router.get('/mine', authenticate, authorize('TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'), resourcesController.myResources);
router.get('/:id', authenticate, resourcesController.getResource); // signed download URL

router.post(
  '/',
  authenticate, authorize('TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'), requireVerified,
  resourcesController.createResource
);

router.patch(
  '/:id/publish',
  authenticate, authorize('TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'),
  resourcesController.publishResource
);

module.exports = router;
