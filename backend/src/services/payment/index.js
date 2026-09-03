const devProvider = require('./devProvider');
const selcomProvider = require('./selcomProvider');
const clickPesaProvider = require('./clickPesaProvider');

/**
 * Payment Provider Factory
 *
 * Supported providers:
 *
 * - development
 * - selcom
 * - clickpesa
 *
 * The active provider is controlled through:
 *
 * PAYMENT_DEFAULT_PROVIDER
 *
 * Examples:
 *
 * Development:
 * PAYMENT_DEFAULT_PROVIDER=development
 *
 * Production:
 * PAYMENT_DEFAULT_PROVIDER=selcom
 *
 * Or:
 * PAYMENT_DEFAULT_PROVIDER=clickpesa
 */

function getPaymentProvider(
  name = process.env.PAYMENT_DEFAULT_PROVIDER
) {
  switch (String(name || '').toLowerCase()) {
    case 'development':
    case 'dev':
      return devProvider;

    case 'clickpesa':
      return clickPesaProvider;

    case 'selcom':
      return selcomProvider;

    default:
      return devProvider;
  }
}

module.exports = getPaymentProvider;