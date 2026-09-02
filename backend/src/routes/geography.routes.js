const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const geographyController = require('../controllers/geography.controller');

const ADMIN_ONLY = ['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'];

// Public — needed for registration forms (region/district pickers)
router.get('/countries', geographyController.listCountries);
router.get('/regions', geographyController.listRegions);
router.get('/districts', geographyController.listDistricts);

router.post('/regions', authenticate, authorize(...ADMIN_ONLY), geographyController.createRegion);
router.post('/districts', authenticate, authorize(...ADMIN_ONLY), geographyController.createDistrict);

module.exports = router;
