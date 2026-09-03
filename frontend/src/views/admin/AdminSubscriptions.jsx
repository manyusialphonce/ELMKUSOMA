import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Badge from '../../components/common/Badge';

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    adminApi.listSubscriptions({ status: status || undefined }).then(({ data }) => setSubscriptions(data.data)).catch(() => {});
  }, [status]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Subscriptions</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {subscriptions.map((s) => (
          <div key={s.id} className="p-3 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{s.user?.fullName}</p>
              <p className="text-xs text-gray-400">
                {s.plan?.name}
                {s.expiresAt && ` · expires ${new Date(s.expiresAt).toLocaleDateString()}`}
              </p>
            </div>
            <Badge status={s.status} />
          </div>
        ))}
        {subscriptions.length === 0 && <p className="text-sm text-gray-500 p-4">No subscriptions found.</p>}
      </div>
    </div>
  );
}
