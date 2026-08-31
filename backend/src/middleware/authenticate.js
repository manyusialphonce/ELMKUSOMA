const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const prisma = require('../config/prisma');

/**
 * Verifies the Bearer token and attaches the authenticated user to req.user.
 * Equivalent to Laravel Sanctum's auth:sanctum middleware.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw ApiError.unauthorized();
    }

    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        accountStatus: true,
        verificationStatus: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized();
    }

    if (user.accountStatus !== 'ACTIVE') {
      throw ApiError.forbidden('Your account is not active. Please contact support.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Invalid or expired token.'));
    }
    next(err);
  }
}

module.exports = authenticate;
