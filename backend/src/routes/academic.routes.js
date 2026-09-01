const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const academicController = require('../controllers/academic.controller');

const ADMIN_ONLY = ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'];

router.get('/departments', academicController.listDepartments);
router.post('/departments', authenticate, authorize(...ADMIN_ONLY), academicController.createDepartment);

router.get('/programmes', academicController.listProgrammes);
router.post('/programmes', authenticate, authorize(...ADMIN_ONLY), academicController.createProgramme);

router.get('/courses', academicController.listCourses);
router.post('/courses', authenticate, authorize(...ADMIN_ONLY), academicController.createCourse);

router.get('/years', academicController.listAcademicYears);
router.post('/years', authenticate, authorize(...ADMIN_ONLY), academicController.createAcademicYear);
router.patch('/years/:id/activate', authenticate, authorize(...ADMIN_ONLY), academicController.activateAcademicYear);

router.post('/semesters', authenticate, authorize(...ADMIN_ONLY), academicController.createSemester);

module.exports = router;
