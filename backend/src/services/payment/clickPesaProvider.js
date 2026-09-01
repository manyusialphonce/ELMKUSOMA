const crypto = require('crypto');

async function initiate(payment) {
  const providerReference = `CP-${payment.id}-${crypto.randomBytes(3).toString('hex')}`;

  return {
    providerReference,
    status: 'pending',
    redirectUrl: null,
    raw: { note: 'ClickPesa integration pending API credentials' },
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

module.exports = { initiate, verify, handleWebhook };
