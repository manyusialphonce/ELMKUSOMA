import { useEffect, useState } from 'react';
import { subscriptionsApi } from '../../api/subscriptions';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';

export default function StudentSubscription() {
  const [plans, setPlans] = useState([]);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [subscribingId, setSubscribingId] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState('selcom');

  const load = () => {
    subscriptionsApi.plans().then(({ data }) => setPlans(data.data)).catch(() => {});
    subscriptionsApi.mine().then(({ data }) => setMySubscriptions(data.data)).catch(() => {});
  };

  useEffect(load, []);

  const handleSubscribe = async (planId) => {
    setError('');
    setInstructions(null);
    setSubscribingId(planId);
    try {
      const { data } = await subscriptionsApi.subscribe({ subscriptionPlanId: planId, provider });
      setInstructions(data.paymentInstructions);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start the subscription.');
    } finally {
      setSubscribingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Subscription</h1>
      <p className="text-gray-500 text-sm mb-6">Choose a plan to unlock live classes, quizzes, and premium resources.</p>

      <Alert type="error">{error}</Alert>

      {instructions && (
        <Alert type="info">
          Payment initiated (reference: {instructions.providerReference}). Follow the prompt on
          your phone to complete payment via {provider === 'selcom' ? 'Selcom' : 'ClickPesa'}.
        </Alert>
      )}

      <label className="block mb-6 max-w-xs">
        <span className="block text-sm font-medium text-gray-700 mb-1">Payment method</span>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="selcom">Selcom (M-Pesa, Tigo Pesa, Airtel Money)</option>
          <option value="clickpesa">ClickPesa</option>
        </select>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {plans.map((plan) => (
          <div key={plan.id} className="border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-gray-900">{plan.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
            <p className="text-2xl font-bold text-blue-900 mt-3">
              {Number(plan.price).toLocaleString()} {plan.currency}
              <span className="text-sm text-gray-400 font-normal"> / {plan.durationDays} days</span>
            </p>
            <Button
              onClick={() => handleSubscribe(plan.id)}
              loading={subscribingId === plan.id}
              className="mt-4 w-full"
            >
              Subscribe
            </Button>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-3">Subscription History</h2>
      <div className="space-y-2">
        {mySubscriptions.map((s) => (
          <div key={s.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center text-sm">
            <div>
              <span className="font-medium">{s.plan?.name}</span>
              {s.expiresAt && (
                <span className="text-gray-500 ml-2">
                  expires {new Date(s.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <Badge status={s.status} />
          </div>
        ))}
        {mySubscriptions.length === 0 && (
          <p className="text-gray-500 text-sm">No subscription history yet.</p>
        )}
      </div>
    </div>
  );
}
