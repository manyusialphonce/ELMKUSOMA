const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const certificatesController = require('../controllers/certificates.controller');

// Public — anyone with the code can verify a certificate's authenticity
router.get('/verify/:code', certificatesController.verifyCertificate);

router.get('/me', authenticate, authorize('STUDENT'), certificatesController.myCertificates);

router.post(
  '/',
  authenticate, authorize('TEACHER', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR'),
  certificatesController.issueCertificate
);

router.patch(
  '/:id/revoke',
  authenticate, authorize('ADMINISTRATOR', 'SUPER_ADMINISTRATOR'),
  certificatesController.revokeCertificate
);

module.exports = router;
