import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { resourcesApi } from '../../api/content';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    adminApi.listResources({ status: status || undefined }).then(({ data }) => setResources(data.data)).catch(() => {});
  };

  useEffect(load, [status]);

  const handlePublish = async (id) => {
    setError('');
    try {
      await resourcesApi.publish(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not publish this resource.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Resources</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <Alert type="error">{error}</Alert>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {resources.map((r) => (
          <div key={r.id} className="p-3 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{r.title}</p>
              <p className="text-xs text-gray-400">{r.type} · {r.uploadedBy?.fullName} · {r.subject?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge status={r.status} />
              {r.status === 'DRAFT' && (
                <button onClick={() => handlePublish(r.id)} className="text-xs font-medium text-blue-700">Publish</button>
              )}
            </div>
          </div>
        ))}
        {resources.length === 0 && <p className="text-sm text-gray-500 p-4">No resources found.</p>}
      </div>
    </div>
  );
}
