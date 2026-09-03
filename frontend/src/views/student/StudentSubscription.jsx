import { useEffect, useState, useCallback } from 'react';

import { subscriptionsApi } from '../../api/subscriptions';

import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';


export default function StudentSubscription() {

  // ======================================
  // STATE
  // ======================================

  const [plans, setPlans] = useState([]);

  const [mySubscriptions, setMySubscriptions] =
    useState([]);

  const [subscribingId, setSubscribingId] =
    useState(null);

  const [confirmingPaymentId, setConfirmingPaymentId] =
    useState(null);

  const [instructions, setInstructions] =
    useState(null);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [provider, setProvider] =
    useState('selcom');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  // ======================================
  // LOAD DATA
  // ======================================

  const load = useCallback(
    async (showRefreshing = false) => {

      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {

        const [
          plansResponse,
          subscriptionsResponse,
        ] = await Promise.all([

          subscriptionsApi.plans(),

          subscriptionsApi.mine(),

        ]);


        setPlans(
          plansResponse.data?.data || []
        );


        setMySubscriptions(
          subscriptionsResponse.data?.data || []
        );


      } catch (err) {

        console.error(
          'SUBSCRIPTION LOAD ERROR:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Unable to load subscription information.'
        );


      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    },
    []
  );


  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {

    load();

  }, [load]);


  // ======================================
  // CHECK ACTIVE SUBSCRIPTION
  // ======================================

  const activeSubscription =
    mySubscriptions.find(
      (subscription) =>
        String(
          subscription.status
        ).toUpperCase() === 'ACTIVE'
    );


  // ======================================
  // CHECK PENDING SUBSCRIPTION
  // ======================================

  const pendingSubscription =
    mySubscriptions.find(
      (subscription) =>
        String(
          subscription.status
        ).toUpperCase() === 'PENDING'
    );


  // ======================================
  // GET PENDING PAYMENT
  // ======================================

  const pendingPayment =
    pendingSubscription?.payments?.find(
      (payment) =>
        String(
          payment.status
        ).toUpperCase() === 'PENDING'
    );


  // ======================================
  // AUTO REFRESH PENDING PAYMENT
  // ======================================

  useEffect(() => {

    if (!pendingSubscription) {
      return undefined;
    }


    const interval = setInterval(
      () => {

        load(true);

      },
      15000
    );


    return () => {

      clearInterval(interval);

    };

  }, [
    pendingSubscription,
    load,
  ]);


  // ======================================
  // SUBSCRIBE
  // ======================================

  const handleSubscribe =
    async (planId) => {

      setError('');

      setSuccess('');

      setInstructions(null);

      setSubscribingId(planId);


      try {

        const response =
          await subscriptionsApi.subscribe({

            subscriptionPlanId: planId,

            provider,

          });


        const data =
          response.data;


        // PAYMENT INSTRUCTIONS

        setInstructions(
          data.paymentInstructions ||
          null
        );


        // Reload subscriptions

        await load(true);


      } catch (err) {

        console.error(
          'SUBSCRIPTION ERROR:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Could not start the subscription.'
        );


      } finally {

        setSubscribingId(null);

      }

    };


  // ======================================
  // CONFIRM DEVELOPMENT PAYMENT
  // ======================================

  const handleConfirmDevelopmentPayment =
    async () => {

      if (!pendingPayment?.id) {

        setError(
          'No pending payment was found.'
        );

        return;

      }


      setError('');

      setSuccess('');

      setConfirmingPaymentId(
        pendingPayment.id
      );


      try {

        await subscriptionsApi
          .confirmDevelopmentPayment(
            pendingPayment.id
          );


        setSuccess(
          'Test payment completed successfully. Your subscription is now active.'
        );


        setInstructions(null);


        // Reload subscription status

        await load(true);


      } catch (err) {

        console.error(
          'TEST PAYMENT ERROR:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Could not confirm the test payment.'
        );


      } finally {

        setConfirmingPaymentId(null);

      }

    };


  // ======================================
  // GET STATUS MESSAGE
  // ======================================

  const getSubscriptionMessage = () => {

    // ACTIVE

    if (activeSubscription) {

      return (

        <Alert type="success">

          <div>

            <p className="font-semibold">

              Your subscription is active.

            </p>


            <p className="mt-1 text-sm">

              You now have access to the
              resources included in your
              subscription plan.

            </p>


            {activeSubscription.expiresAt && (

              <p className="mt-2 text-sm">

                Expires on{' '}

                <strong>

                  {new Date(
                    activeSubscription.expiresAt
                  ).toLocaleDateString()}

                </strong>

              </p>

            )}

          </div>

        </Alert>

      );

    }


    // PENDING

    if (pendingSubscription) {

      return (

        <Alert type="info">

          <div>

            <p className="font-semibold">

              Payment is pending confirmation.

            </p>


            <p className="mt-1 text-sm">

              Complete the payment on your
              phone. This page will
              automatically check your
              payment status.

            </p>


            <p className="mt-2 text-xs">

              Current status: PENDING

            </p>

          </div>

        </Alert>

      );

    }


    return null;

  };


  // ======================================
  // LOADING
  // ======================================

  if (loading) {

    return (

      <div className="py-12 text-center">

        <div
          className="
            mx-auto
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-blue-100
            border-t-blue-600
          "
        />


        <p className="mt-4 text-sm text-gray-500">

          Loading subscription information...

        </p>

      </div>

    );

  }


  // ======================================
  // UI
  // ======================================

  return (

    <div>


      {/* ==================================
          PAGE HEADER
      =================================== */}

      <div className="mb-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">


          <div>

            <h1 className="text-xl font-bold text-gray-900">

              Subscription

            </h1>


            <p className="mt-1 text-sm text-gray-500">

              Choose a plan to unlock live
              classes, quizzes, and premium
              resources.

            </p>

          </div>


          <Button
            onClick={() => load(true)}
            loading={refreshing}
          >

            Refresh Status

          </Button>


        </div>

      </div>


      {/* ==================================
          ERROR
      =================================== */}

      {error && (

        <div className="mb-5">

          <Alert type="error">

            {error}

          </Alert>

        </div>

      )}


      {/* ==================================
          SUCCESS
      =================================== */}

      {success && (

        <div className="mb-5">

          <Alert type="success">

            {success}

          </Alert>

        </div>

      )}


      {/* ==================================
          ACTIVE / PENDING STATUS
      =================================== */}

      <div className="mb-5">

        {getSubscriptionMessage()}

      </div>


      {/* ==================================
          PAYMENT INSTRUCTIONS
      =================================== */}

      {instructions && (

        <div className="mb-6">

          <Alert type="info">

            <div>

              <p className="font-semibold">

                Payment initiated

              </p>


              {instructions.providerReference && (

                <p className="mt-1 text-sm">

                  Reference:{' '}

                  <strong>

                    {instructions.providerReference}

                  </strong>

                </p>

              )}


              <p className="mt-2 text-sm">

                Follow the payment prompt on
                your phone to complete payment
                via{' '}

                <strong>

                  {
                    provider === 'selcom'
                      ? 'Selcom'
                      : 'ClickPesa'
                  }

                </strong>.

              </p>

            </div>

          </Alert>

        </div>

      )}


      {/* ==================================
          DEVELOPMENT TEST PAYMENT
      =================================== */}

      {pendingPayment && !activeSubscription && (

        <div
          className="
            mb-6
            rounded-lg
            border
            border-dashed
            border-amber-300
            bg-amber-50
            p-5
          "
        >

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


            <div>

              <p className="font-semibold text-amber-900">

                Development Test Payment

              </p>


              <p className="mt-1 text-sm text-amber-800">

                This button is for development
                testing only. It simulates a
                successful payment without using
                real Selcom or ClickPesa money.

              </p>

            </div>


            <Button
              onClick={
                handleConfirmDevelopmentPayment
              }
              loading={
                confirmingPaymentId ===
                pendingPayment.id
              }
            >

              Complete Test Payment

            </Button>


          </div>

        </div>

      )}


      {/* ==================================
          PAYMENT METHOD
      =================================== */}

      {!activeSubscription && (

        <label className="mb-6 block max-w-md">


          <span
            className="
              mb-1
              block
              text-sm
              font-medium
              text-gray-700
            "
          >

            Payment method

          </span>


          <select
            value={provider}

            onChange={(event) =>
              setProvider(
                event.target.value
              )
            }

            disabled={
              Boolean(pendingSubscription)
            }

            className="
              w-full
              rounded-md
              border
              border-gray-300
              px-3
              py-2
              text-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              disabled:cursor-not-allowed
              disabled:bg-gray-100
            "
          >

            <option value="selcom">

              Selcom
              (M-Pesa, Tigo Pesa,
              Airtel Money)

            </option>


            <option value="clickpesa">

              ClickPesa

            </option>

          </select>

        </label>

      )}


      {/* ==================================
          SUBSCRIPTION PLANS
      =================================== */}

      <div
        className="
          mb-8
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
        "
      >

        {plans.map((plan) => {

          const isSubscribing =
            subscribingId === plan.id;


          const hasActivePlan =
            Boolean(activeSubscription);


          const hasPendingPayment =
            Boolean(pendingSubscription);


          return (

            <div
              key={plan.id}

              className="
                rounded-lg
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
              "
            >


              <h2 className="font-semibold text-gray-900">

                {plan.name}

              </h2>


              <p className="mt-1 text-sm text-gray-500">

                {plan.description}

              </p>


              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-blue-900
                "
              >

                {Number(
                  plan.price
                ).toLocaleString()}{' '}

                {plan.currency}


                <span
                  className="
                    text-sm
                    font-normal
                    text-gray-400
                  "
                >

                  {' '}/{' '}

                  {plan.durationDays}{' '}

                  days

                </span>

              </p>


              <Button

                onClick={() =>
                  handleSubscribe(
                    plan.id
                  )
                }

                loading={isSubscribing}

                disabled={
                  hasActivePlan ||
                  hasPendingPayment
                }

                className="mt-4 w-full"
              >

                {hasActivePlan
                  ? 'Subscription Active'
                  : hasPendingPayment
                    ? 'Payment Pending'
                    : 'Subscribe'
                }

              </Button>


            </div>

          );

        })}

      </div>


      {/* ==================================
          SUBSCRIPTION HISTORY
      =================================== */}

      <div>


        <div
          className="
            mb-3
            flex
            items-center
            justify-between
          "
        >

          <h2 className="text-lg font-semibold text-gray-900">

            Subscription History

          </h2>


          {pendingSubscription && (

            <span className="text-xs text-gray-500">

              Checking payment status
              automatically...

            </span>

          )}

        </div>


        <div className="space-y-2">


          {mySubscriptions.map(
            (subscription) => (

              <div
                key={subscription.id}

                className="
                  flex
                  flex-col
                  gap-3
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  p-4
                  text-sm
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >


                <div>

                  <span className="font-medium text-gray-900">

                    {
                      subscription.plan?.name ||
                      'Subscription Plan'
                    }

                  </span>


                  {subscription.createdAt && (

                    <p className="mt-1 text-xs text-gray-500">

                      Started:{' '}

                      {new Date(
                        subscription.createdAt
                      ).toLocaleDateString()}

                    </p>

                  )}


                  {subscription.expiresAt && (

                    <p className="mt-1 text-xs text-gray-500">

                      Expires:{' '}

                      {new Date(
                        subscription.expiresAt
                      ).toLocaleDateString()}

                    </p>

                  )}


                  {/* PAYMENT DETAILS */}

                  {subscription.payments?.length > 0 && (

                    <p className="mt-1 text-xs text-gray-500">

                      Payment:{' '}

                      <strong>

                        {
                          subscription.payments[0]
                            ?.status
                        }

                      </strong>

                    </p>

                  )}


                </div>


                <Badge
                  status={
                    subscription.status
                  }
                />


              </div>

            )
          )}


          {mySubscriptions.length === 0 && (

            <div
              className="
                rounded-lg
                border
                border-dashed
                border-gray-300
                p-6
                text-center
              "
            >

              <p className="text-sm text-gray-500">

                No subscription history yet.

              </p>

            </div>

          )}


        </div>


      </div>


    </div>

  );

}