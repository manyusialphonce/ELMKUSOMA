const ApiError = require('../utils/ApiError');
const prisma = require('../config/prisma');

/**
 * Enforces SRS Business Rules BR-002 / BR-004:
 * "A user must have an active subscription where the requested service
 * requires subscription access." Role + permission alone is not enough.
 */
async function requireActiveSubscription(req, res, next) {
  try {
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
      orderBy: { expiresAt: 'desc' },
    });

    if (!activeSubscription) {
      throw ApiError.forbidden('An active subscription is required to access this service.');
    }

    req.activeSubscription = activeSubscription;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireActiveSubscription;
