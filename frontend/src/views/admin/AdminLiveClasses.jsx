import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Badge from '../../components/common/Badge';

export default function AdminLiveClasses() {
  const [liveClasses, setLiveClasses] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    adminApi.listLiveClasses({ status: status || undefined }).then(({ data }) => setLiveClasses(data.data)).catch(() => {});
  }, [status]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Live Classes</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
          <option value="">All statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="LIVE">Live</option>
          <option value="ENDED">Ended</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {liveClasses.map((lc) => (
          <div key={lc.id} className="p-3 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{lc.topic}</p>
              <p className="text-xs text-gray-400">
                {lc.teacher?.fullName} · {lc.subject?.name} · {lc._count?.attendances} attendees
              </p>
            </div>
            <Badge status={lc.status} />
          </div>
        ))}
        {liveClasses.length === 0 && <p className="text-sm text-gray-500 p-4">No live classes found.</p>}
      </div>
    </div>
  );
}
