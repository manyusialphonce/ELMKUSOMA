const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { registerRules, loginRules } = require('../validators/auth.validators');
const authController = require('../controllers/auth.controller');

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);

module.exports = router;
