const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const schoolsController = require('../controllers/schools.controller');

router.get('/', schoolsController.listSchools); // public
router.get('/:slug', schoolsController.getSchoolBySlug); // public

router.post(
  '/',
  authenticate,
  authorize('ADMINISTRATOR', 'SUPER_ADMINISTRATOR', 'SCHOOL_ADMINISTRATOR'),
  schoolsController.createSchool
);

module.exports = router;
