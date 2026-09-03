const crypto = require('crypto');

/**
 * Development payment provider.
 *
 * This provider is ONLY for local development/testing.
 * It does not contact a real payment gateway.
 *
 * Real production providers remain:
 * - selcomProvider.js
 * - clickPesaProvider.js
 */

async function initiate(payment) {
  const providerReference =
    `DEV-${payment.id}-${crypto.randomBytes(3).toString('hex')}`;

  return {
    providerReference,
    status: 'pending',
    redirectUrl: null,
    raw: {
      mode: 'development',
      note: 'Development payment simulation',
    },
  };
}

async function verify(payment) {
  return {
    providerReference: payment.providerReference,
    status: payment.status.toLowerCase(),
  };
}

async function handleWebhook(payload) {
  return payload.reference || '';
}

module.exports = {
  initiate,
  verify,
  handleWebhook,
};