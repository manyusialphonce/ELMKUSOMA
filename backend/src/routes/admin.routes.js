const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const adminController = require('../controllers/admin.controller');
const settingsController = require('../controllers/settings.controller');

const ADMIN_ONLY = ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'];

router.use(authenticate, authorize(...ADMIN_ONLY));

router.get('/verifications', adminController.listVerifications);
router.patch('/verifications/:userId/approve', adminController.approveVerification);
router.patch('/verifications/:userId/reject', adminController.rejectVerification);

router.get('/users', adminController.listUsers);
router.patch('/users/:id/suspend', adminController.suspendUser);
router.patch('/users/:id/reactivate', adminController.reactivateUser);

router.get('/audit-logs', adminController.listAuditLogs);

router.get('/settings', settingsController.listSettings);
router.put('/settings/:key', authorize('SUPER_ADMINISTRATOR'), settingsController.upsertSetting);

module.exports = router;
