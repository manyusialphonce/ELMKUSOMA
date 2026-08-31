const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const parentsController = require('../controllers/parents.controller');

router.use(authenticate, authorize('PARENT'));

router.get('/children', parentsController.listChildren);
router.post('/children', parentsController.linkChild);
router.delete('/children/:studentId', parentsController.unlinkChild);
router.get('/children/:studentId/progress', parentsController.getChildProgress);
router.get('/children/:studentId/certificates', parentsController.getChildCertificates);

module.exports = router;
