const crypto = require('crypto');

// Real implementation would call Selcom's checkout API here using
// SELCOM_VENDOR_ID / SELCOM_API_KEY / SELCOM_API_SECRET from .env.
// Kept as a clearly-marked stub so the interface is usable immediately
// while the merchant account is being set up.

async function initiate(payment) {
  const providerReference = `ELMK-${payment.id}-${crypto.randomBytes(3).toString('hex')}`;

  // const response = await axios.post('https://apigw.selcommobile.com/v1/checkout/create-order', {...});

  return {
    providerReference,
    status: 'pending',
    redirectUrl: null,
    raw: { note: 'Selcom integration pending API credentials' },
  };
}

async function verify(payment) {
  return {
    providerReference: payment.providerReference,
    status: payment.status.toLowerCase(),
  };
}

async function handleWebhook(payload) {
  return payload.order_id || '';
}

module.exports = { initiate, verify, handleWebhook };
