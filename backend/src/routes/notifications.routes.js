const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const notificationsController = require('../controllers/notifications.controller');

router.get('/', authenticate, notificationsController.listNotifications);
router.get('/preferences', authenticate, notificationsController.getPreferences);
router.put('/preferences', authenticate, notificationsController.updatePreferences);
router.patch('/read-all', authenticate, notificationsController.markAllAsRead);
router.patch('/:id/read', authenticate, notificationsController.markAsRead);

module.exports = router;
