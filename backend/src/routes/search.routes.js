const router = require('express').Router();
const searchController = require('../controllers/search.controller');

router.get('/', searchController.globalSearch); // public

module.exports = router;
