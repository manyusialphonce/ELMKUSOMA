const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const educationController = require('../controllers/education.controller');

const ADMIN_ONLY = ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'];

router.get('/levels', educationController.listEducationLevels);
router.post('/levels', authenticate, authorize(...ADMIN_ONLY), educationController.createEducationLevel);

router.get('/levels/:id/classes', educationController.listClassesForLevel);
router.post('/classes', authenticate, authorize(...ADMIN_ONLY), educationController.createClass);

router.get('/subjects', educationController.listSubjects);
router.post('/subjects', authenticate, authorize(...ADMIN_ONLY), educationController.createSubject);

router.get('/universities', educationController.listUniversities);

module.exports = router;
