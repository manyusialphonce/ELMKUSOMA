const router = require('express').Router();
const educationController = require('../controllers/education.controller');

router.get('/levels', educationController.listEducationLevels);
router.get('/levels/:id/classes', educationController.listClassesForLevel);
router.get('/subjects', educationController.listSubjects);
router.get('/universities', educationController.listUniversities);

module.exports = router;
