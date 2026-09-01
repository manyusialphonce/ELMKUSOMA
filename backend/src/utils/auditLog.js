const prisma = require('../config/prisma');

/**
 * Records an administrative or security-sensitive action (SRS v1.0 §19/§24).
 * Call this from controllers after actions like suspending a user, approving
 * a verification, revoking a certificate, etc. Never throws — logging must
 * never break the calling request.
 */
async function logAction(actorId, action, { entity, entityId, metadata } = {}) {
  try {
    await prisma.auditLog.create({
      data: { actorId: actorId || null, action, entity: entity || null, entityId: entityId || null, metadata: metadata || null },
    });
  } catch (err) {
    console.error('[audit-log] failed to record action:', action, err.message);
  }
}

module.exports = { logAction };
