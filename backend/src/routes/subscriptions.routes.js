const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const subscriptionsController = require('../controllers/subscriptions.controller');

router.get('/plans', subscriptionsController.listPlans); // public
router.get('/me', authenticate, subscriptionsController.mySubscriptions);
router.post('/', authenticate, subscriptionsController.subscribe);

module.exports = router;
