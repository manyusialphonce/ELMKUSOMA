const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const getPaymentProvider = require('../services/payment');
const { notifyUser } = require('./notifications.controller');


// =============================================
// GET SUBSCRIPTION PLANS
// GET /api/v1/subscriptions/plans
// Public
// =============================================

const listPlans = asyncHandler(async (req, res) => {
  const plans = await prisma.subscriptionPlan.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: 'asc',
    },
  });

  res.json({
    data: plans,
  });
});


// =============================================
// CREATE SUBSCRIPTION
// POST /api/v1/subscriptions
// =============================================

const subscribe = asyncHandler(async (req, res) => {
  const {
    subscriptionPlanId,
    provider,
  } = req.body;


  // ---------------------------------------------
  // FIND PLAN
  // ---------------------------------------------

  const plan =
    await prisma.subscriptionPlan.findUnique({
      where: {
        id: Number(subscriptionPlanId),
      },
    });


  if (!plan || !plan.isActive) {
    throw ApiError.notFound(
      'Subscription plan not found.'
    );
  }


  // ---------------------------------------------
  // PREVENT DUPLICATE ACTIVE SUBSCRIPTION
  // ---------------------------------------------

  const activeSubscription =
    await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        expiresAt: 'desc',
      },
    });


  if (activeSubscription) {
    throw ApiError.badRequest(
      'You already have an active subscription.'
    );
  }


  // ---------------------------------------------
  // CREATE SUBSCRIPTION + PAYMENT
  // ---------------------------------------------

  const result =
    await prisma.$transaction(async (tx) => {

      const subscription =
        await tx.subscription.create({
          data: {
            userId: req.user.id,
            subscriptionPlanId: plan.id,
            status: 'PENDING',
          },
        });


      const payment =
        await tx.payment.create({
          data: {
            userId: req.user.id,
            subscriptionId: subscription.id,
            amount: plan.price,
            currency: plan.currency,
            provider:
              provider ||
              process.env.PAYMENT_DEFAULT_PROVIDER,
            status: 'PENDING',
          },
        });


      return {
        subscription,
        payment,
      };

    });


  // ---------------------------------------------
  // INITIATE PAYMENT PROVIDER
  // ---------------------------------------------

  const selectedProvider =
    provider ||
    process.env.PAYMENT_DEFAULT_PROVIDER;


  const paymentProvider =
    getPaymentProvider(selectedProvider);


  const initiation =
    await paymentProvider.initiate(
      result.payment
    );


  // ---------------------------------------------
  // SAVE PROVIDER REFERENCE
  // ---------------------------------------------

  const payment =
    await prisma.payment.update({
      where: {
        id: result.payment.id,
      },
      data: {
        providerReference:
          initiation.providerReference,
      },
    });


  // ---------------------------------------------
  // RESPONSE
  // ---------------------------------------------

  res.status(201).json({

    subscription:
      result.subscription,

    payment,

    development:
      process.env.NODE_ENV === 'development',

    paymentInstructions: {

      redirectUrl:
        initiation.redirectUrl,

      providerReference:
        initiation.providerReference,

      paymentId:
        payment.id,

    },

  });

});


// =============================================
// GET MY SUBSCRIPTIONS
// GET /api/v1/subscriptions/me
// =============================================

const mySubscriptions =
  asyncHandler(async (req, res) => {

    const subscriptions =
      await prisma.subscription.findMany({

        where: {
          userId: req.user.id,
        },

        include: {
          plan: true,
          payments: true,
        },

        orderBy: {
          createdAt: 'desc',
        },

      });


    res.json({
      data: subscriptions,
    });

  });


// =============================================
// CONFIRM DEVELOPMENT PAYMENT
// POST /api/v1/subscriptions/payments/:paymentId/confirm
//
// DEVELOPMENT ONLY
// =============================================

const confirmDevelopmentPayment =
  asyncHandler(async (req, res) => {

    // ------------------------------------------
    // PROTECT PRODUCTION
    // ------------------------------------------

    if (
      process.env.NODE_ENV === 'production'
    ) {

      throw ApiError.forbidden(
        'Development payment confirmation is not available in production.'
      );

    }


    const paymentId =
      Number(req.params.paymentId);


    // ------------------------------------------
    // FIND PAYMENT
    // ------------------------------------------

    const payment =
      await prisma.payment.findFirst({

        where: {
          id: paymentId,

          userId: req.user.id,
        },

        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },

      });


    if (!payment) {

      throw ApiError.notFound(
        'Payment not found.'
      );

    }


    // ------------------------------------------
    // ALREADY SUCCESSFUL
    // ------------------------------------------

    if (
      payment.status === 'SUCCESSFUL'
    ) {

      return res.json({

        message:
          'Payment is already confirmed.',

        payment,

      });

    }


    // ------------------------------------------
    // VALIDATE SUBSCRIPTION
    // ------------------------------------------

    if (!payment.subscription) {

      throw ApiError.badRequest(
        'This payment is not linked to a subscription.'
      );

    }


    const plan =
      payment.subscription.plan;


    // ------------------------------------------
    // CALCULATE SUBSCRIPTION DATES
    // ------------------------------------------

    const startsAt =
      new Date();


    const expiresAt =
      new Date(startsAt);


    expiresAt.setDate(
      expiresAt.getDate() +
      plan.durationDays
    );


    // ------------------------------------------
    // UPDATE PAYMENT + SUBSCRIPTION
    // ------------------------------------------

    const updated =
      await prisma.$transaction(
        async (tx) => {

          const updatedPayment =
            await tx.payment.update({

              where: {
                id: payment.id,
              },

              data: {

                status:
                  'SUCCESSFUL',

                paidAt:
                  new Date(),

              },

            });


          const updatedSubscription =
            await tx.subscription.update({

              where: {
                id:
                  payment.subscriptionId,
              },

              data: {

                status:
                  'ACTIVE',

                startsAt,

                expiresAt,

              },

              include: {
                plan: true,
              },

            });


          return {

            payment:
              updatedPayment,

            subscription:
              updatedSubscription,

          };

        }
      );


    // ------------------------------------------
    // NOTIFICATION
    // ------------------------------------------

    try {

      await notifyUser(
        req.user.id,

        'PAYMENT_CONFIRMATION',

        'Payment received',

        {

          paymentId:
            payment.id,

          amount:
            payment.amount,

        }
      );

    } catch (notificationError) {

      console.error(
        'PAYMENT NOTIFICATION ERROR:',
        notificationError
      );

    }


    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.json({

      message:
        'Development payment confirmed successfully.',

      data:
        updated,

    });

  });


// =============================================
// PAYMENT WEBHOOK
//
// POST /api/v1/payments/webhook/:provider
//
// CALLED BY:
// - SELCOM
// - CLICKPESA
// =============================================

const handleWebhook =
  asyncHandler(async (req, res) => {

    const paymentProvider =
      getPaymentProvider(
        req.params.provider
      );


    const providerReference =
      await paymentProvider.handleWebhook(
        req.body
      );


    const payment =
      await prisma.payment.findFirst({

        where: {
          providerReference,
        },

      });


    // Always return 200 to payment providers
    // so they do not retry forever.

    if (!payment) {

      return res.status(200).json({
        received: true,
      });

    }


    // ------------------------------------------
    // PREVENT DOUBLE PROCESSING
    // ------------------------------------------

    if (
      payment.status === 'SUCCESSFUL'
    ) {

      return res.status(200).json({
        received: true,
        alreadyProcessed: true,
      });

    }


    // ------------------------------------------
    // UPDATE PAYMENT + SUBSCRIPTION
    // ------------------------------------------

    await prisma.$transaction(
      async (tx) => {

        await tx.payment.update({

          where: {
            id: payment.id,
          },

          data: {

            status:
              'SUCCESSFUL',

            paidAt:
              new Date(),

          },

        });


        if (
          payment.subscriptionId
        ) {

          const subscription =
            await tx.subscription.findUnique({

              where: {
                id:
                  payment.subscriptionId,
              },

              include: {
                plan: true,
              },

            });


          if (subscription) {

            const startsAt =
              new Date();


            const expiresAt =
              new Date(
                startsAt
              );


            expiresAt.setDate(
              expiresAt.getDate() +
              subscription.plan.durationDays
            );


            await tx.subscription.update({

              where: {
                id:
                  subscription.id,
              },

              data: {

                status:
                  'ACTIVE',

                startsAt,

                expiresAt,

              },

            });

          }

        }

      }
    );


    // ------------------------------------------
    // NOTIFICATION
    // ------------------------------------------

    try {

      await notifyUser(
        payment.userId,

        'PAYMENT_CONFIRMATION',

        'Payment received',

        {

          paymentId:
            payment.id,

          amount:
            payment.amount,

        }
      );

    } catch (notificationError) {

      console.error(
        'PAYMENT NOTIFICATION ERROR:',
        notificationError
      );

    }


    res.status(200).json({
      received: true,
    });

  });


// =============================================
// EXPORTS
// =============================================

module.exports = {

  listPlans,

  subscribe,

  mySubscriptions,

  confirmDevelopmentPayment,

  handleWebhook,

};