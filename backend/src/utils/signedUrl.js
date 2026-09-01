const crypto = require('crypto');

/**
 * Generates a short-lived signed URL for a private storage object.
 * This is the ONE place that turns a storageKey into something a browser
 * can fetch — nothing in the codebase should expose storageKey values or
 * public bucket URLs directly (SRS §11.1 / §11.5 / BR-010, BR-011).
 *
 * Swap this implementation for your actual S3/DigitalOcean Spaces SDK call
 * (getSignedUrl) once storage credentials are configured — the interface
 * (storageKey, userId) -> signedUrl stays the same either way.
 */
function generateSignedUrl(storageKey, { userId, expiresInSeconds = 300 } = {}) {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const payload = `${storageKey}:${userId}:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'dev-secret')
    .update(payload)
    .digest('hex');

  const base = process.env.S3_ENDPOINT || 'https://storage.elmkusoma.com';
  return `${base}/${storageKey}?expires=${expiresAt}&signature=${signature}&uid=${userId}`;
}

module.exports = { generateSignedUrl };
