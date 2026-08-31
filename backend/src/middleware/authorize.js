const ApiError = require('../utils/ApiError');

/**
 * Restricts a route to one or more roles.
 * Usage: router.post('/live-classes', authenticate, authorize('TEACHER'), ...)
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }

    next();
  };
}

module.exports = authorize;
