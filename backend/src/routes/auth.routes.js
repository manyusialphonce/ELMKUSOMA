const express = require('express');

const router = express.Router();

const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');

const {
  registerRules,
  loginRules,
} = require('../validators/auth.validators');

const authController = require('../controllers/auth.controller');


// ============================================
// PUBLIC AUTH ROUTES
// ============================================

// REGISTER
router.post(
  '/register',
  registerRules,
  validate,
  authController.register
);


// LOGIN
router.post(
  '/login',
  loginRules,
  validate,
  authController.login
);


// ============================================
// PROTECTED AUTH ROUTES
// ============================================

// LOGOUT
router.post(
  '/logout',
  authenticate,
  authController.logout
);


// GET CURRENT USER
router.get(
  '/me',
  authenticate,
  authController.me
);


module.exports = router;