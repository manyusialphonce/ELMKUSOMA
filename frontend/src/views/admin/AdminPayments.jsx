import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Badge from '../../components/common/Badge';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    adminApi.listPayments({ status: status || undefined }).then(({ data }) => setPayments(data.data)).catch(() => {});
  }, [status]);

  const total = payments
    .filter((p) => p.status === 'SUCCESSFUL')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Payments</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESSFUL">Successful</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Total successful (shown below): <span className="font-semibold text-gray-900">{total.toLocaleString()} TZS</span>
      </p>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {payments.map((p) => (
          <div key={p.id} className="p-3 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{p.user?.fullName}</p>
              <p className="text-xs text-gray-400">
                {Number(p.amount).toLocaleString()} {p.currency} via {p.provider} · {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge status={p.status} />
          </div>
        ))}
        {payments.length === 0 && <p className="text-sm text-gray-500 p-4">No payments found.</p>}
      </div>
    </div>
  );
}
