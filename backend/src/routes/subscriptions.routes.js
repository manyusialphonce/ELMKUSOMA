const router = require('express').Router();

const authenticate =
  require('../middleware/authenticate');

const subscriptionsController =
  require('../controllers/subscriptions.controller');


// =============================================
// PUBLIC
// =============================================

router.get(
  '/plans',
  subscriptionsController.listPlans
);


// =============================================
// AUTHENTICATED USER
// =============================================

// GET MY SUBSCRIPTIONS

router.get(
  '/me',

  authenticate,

  subscriptionsController.mySubscriptions
);


// CREATE SUBSCRIPTION

router.post(
  '/',

  authenticate,

  subscriptionsController.subscribe
);


// =============================================
// DEVELOPMENT PAYMENT CONFIRMATION
//
// POST:
// /api/v1/subscriptions/payments/:paymentId/confirm
// =============================================

router.post(
  '/payments/:paymentId/confirm',

  authenticate,

  subscriptionsController.confirmDevelopmentPayment
);


module.exports = router;