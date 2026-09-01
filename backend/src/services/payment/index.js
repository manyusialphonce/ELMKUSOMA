const selcomProvider = require('./selcomProvider');
const clickPesaProvider = require('./clickPesaProvider');

/**
 * Service-oriented payments (Strategy pattern): every provider module exports
 * the same three functions — initiate(payment), verify(payment),
 * handleWebhook(payload) — so callers never depend on a concrete provider.
 * Swapping the active provider is a config/env change only.
 */
function getPaymentProvider(name = process.env.PAYMENT_DEFAULT_PROVIDER) {
  switch (name) {
    case 'clickpesa':
      return clickPesaProvider;
    case 'selcom':
    default:
      return selcomProvider;
  }
}

module.exports = getPaymentProvider;
