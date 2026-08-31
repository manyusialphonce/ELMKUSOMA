import { useEffect, useState } from 'react';
import { advertisementsApi } from '../../api/advertisements';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function AdminAdvertisements() {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  const load = () => {
    advertisementsApi.pending().then(({ data }) => setPending(data.data)).catch(() => {});
  };

  useEffect(load, []);

  const handleApprove = async (id) => {
    setActingId(id);
    try {
      await advertisementsApi.approve(id);
      setPending((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not approve.');
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):') || undefined;
    setActingId(id);
    try {
      await advertisementsApi.reject(id, reason);
      setPending((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reject.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">ED Advertising — Moderation</h1>
      <p className="text-gray-500 text-sm mb-6">Review submissions before they go live (SRS BR-008).</p>

      <Alert type="error">{error}</Alert>

      <div className="space-y-3">
        {pending.map((ad) => (
          <div key={ad.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{ad.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{ad.category} · by {ad.advertiser?.fullName}</p>
                {ad.description && <p className="text-sm text-gray-600 mt-2">{ad.description}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(ad.startDate).toLocaleDateString()} – {new Date(ad.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleReject(ad.id)} loading={actingId === ad.id}>
                  Reject
                </Button>
                <Button onClick={() => handleApprove(ad.id)} loading={actingId === ad.id}>
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))}
        {pending.length === 0 && <p className="text-gray-500 text-sm">No pending submissions.</p>}
      </div>
    </div>
  );
}
