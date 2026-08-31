const router = require('express').Router();
const geographyController = require('../controllers/geography.controller');

// Public — needed for registration forms (region/district pickers)
router.get('/regions', geographyController.listRegions);
router.get('/districts', geographyController.listDistricts);

module.exports = router;
