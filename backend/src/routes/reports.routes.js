const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const reportsController = require('../controllers/reports.controller');

router.get('/student/me', authenticate, authorize('STUDENT'), reportsController.studentReport);
router.get('/teacher/me', authenticate, authorize('TEACHER'), reportsController.teacherReport);

router.get(
  '/admin/overview',
  authenticate, authorize('ADMINISTRATOR', 'SUPER_ADMINISTRATOR'),
  reportsController.adminOverview
);
router.get(
  '/admin/geography',
  authenticate, authorize('ADMINISTRATOR', 'SUPER_ADMINISTRATOR'),
  reportsController.geographyReport
);

module.exports = router;
