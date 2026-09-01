const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const advertisementsController = require('../controllers/advertisements.controller');

const ADMIN_ONLY = ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'];

router.get('/', advertisementsController.listAdvertisements); // public

router.get('/mine', authenticate, authorize('ADVERTISER'), advertisementsController.myAdvertisements);
router.post('/', authenticate, authorize('ADVERTISER', ...ADMIN_ONLY), advertisementsController.createAdvertisement);

router.get('/pending', authenticate, authorize(...ADMIN_ONLY), advertisementsController.listPending);
router.patch('/:id/approve', authenticate, authorize(...ADMIN_ONLY), advertisementsController.approveAdvertisement);
router.patch('/:id/reject', authenticate, authorize(...ADMIN_ONLY), advertisementsController.rejectAdvertisement);

module.exports = router;
