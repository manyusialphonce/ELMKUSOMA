const router = require('express').Router();
const subscriptionsController = require('../controllers/subscriptions.controller');

// Called by the payment provider's servers, not by the frontend.
// In production, verify the request signature/secret here before trusting it.
router.post('/webhook/:provider', subscriptionsController.handleWebhook);

module.exports = router;
