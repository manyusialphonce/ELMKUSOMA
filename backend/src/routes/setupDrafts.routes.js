const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const setupDraftsController = require('../controllers/setupDrafts.controller');

router.use(authenticate, authorize('SCHOOL_ADMINISTRATOR', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'));

router.get('/', setupDraftsController.getActiveDraft);
router.post('/', setupDraftsController.startDraft);
router.put('/:id', setupDraftsController.updateDraft);
router.post('/:id/complete', setupDraftsController.completeDraft);

module.exports = router;
