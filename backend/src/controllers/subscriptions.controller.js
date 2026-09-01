const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const getPaymentProvider = require('../services/payment');
const { notifyUser } = require('./notifications.controller');

// GET /api/v1/subscriptions/plans (public)
const listPlans = asyncHandler(async (req, res) => {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  });
  res.json({ data: plans });
});

// POST /api/v1/subscriptions  { subscriptionPlanId, provider }
// Creates a pending subscription + payment, then asks the chosen provider
// to initiate the actual mobile-money/card transaction.
const subscribe = asyncHandler(async (req, res) => {
  const { subscriptionPlanId, provider } = req.body;

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: Number(subscriptionPlanId) } });
  if (!plan || !plan.isActive) throw ApiError.notFound('Subscription plan not found.');

  const result = await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.create({
      data: {
        userId: req.user.id,
        subscriptionPlanId: plan.id,
        status: 'PENDING',
      },
    });

    const payment = await tx.payment.create({
      data: {
        userId: req.user.id,
        subscriptionId: subscription.id,
        amount: plan.price,
        currency: plan.currency,
        provider: provider || process.env.PAYMENT_DEFAULT_PROVIDER,
        status: 'PENDING',
      },
    });

    return { subscription, payment };
  });

  const paymentProvider = getPaymentProvider(provider);
  const initiation = await paymentProvider.initiate(result.payment);

  const payment = await prisma.payment.update({
    where: { id: result.payment.id },
    data: { providerReference: initiation.providerReference },
  });

  res.status(201).json({
    subscription: result.subscription,
    payment,
    paymentInstructions: {
      redirectUrl: initiation.redirectUrl,
      providerReference: initiation.providerReference,
    },
  });
});

// GET /api/v1/subscriptions/me
const mySubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: req.user.id },
    include: { plan: true, payments: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: subscriptions });
});

// POST /api/v1/payments/webhook/:provider  (called by Selcom/ClickPesa servers)
const handleWebhook = asyncHandler(async (req, res) => {
  const paymentProvider = getPaymentProvider(req.params.provider);
  const providerReference = await paymentProvider.handleWebhook(req.body);

  const payment = await prisma.payment.findFirst({ where: { providerReference } });
  if (!payment) {
    // Always 200 to webhooks even on a miss, so the provider doesn't retry forever
    return res.status(200).json({ received: true });
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCESSFUL', paidAt: new Date() },
    });

    if (payment.subscriptionId) {
      const plan = await tx.subscription.findUnique({
        where: { id: payment.subscriptionId },
        include: { plan: true },
      });

      const startsAt = new Date();
      const expiresAt = new Date(startsAt);
      expiresAt.setDate(expiresAt.getDate() + plan.plan.durationDays);

      await tx.subscription.update({
        where: { id: payment.subscriptionId },
        data: { status: 'ACTIVE', startsAt, expiresAt },
      });
    }
  });

  await notifyUser(payment.userId, 'PAYMENT_CONFIRMATION', 'Payment received', {
    paymentId: payment.id,
    amount: payment.amount,
  });

  res.status(200).json({ received: true });
});

module.exports = { listPlans, subscribe, mySubscriptions, handleWebhook };
