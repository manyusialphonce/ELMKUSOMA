const ApiError = require('../utils/ApiError');

/**
 * Per founder's notes: a teacher/lecturer must have their identity verified
 * (NIDA/Passport reviewed by an admin) before they can create live classes,
 * upload recordings, or publish resources.
 */
function requireVerified(req, res, next) {
  if (req.user.role === 'TEACHER' && req.user.verificationStatus !== 'VERIFIED') {
    return next(ApiError.forbidden(
      'Your identity must be verified before you can publish content. Please complete verification.'
    ));
  }
  next();
}

module.exports = requireVerified;
