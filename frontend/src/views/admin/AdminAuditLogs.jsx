import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    client.get('/admin/audit-logs').then(({ data }) => setLogs(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Audit Logs</h1>
      <p className="text-gray-500 text-sm mb-6">Record of significant administrative actions.</p>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {logs.map((log) => (
          <div key={log.id} className="p-3 text-sm flex justify-between items-center">
            <div>
              <span className="font-medium text-gray-900">{log.action}</span>
              {log.entity && <span className="text-gray-500"> · {log.entity}#{log.entityId}</span>}
              <p className="text-xs text-gray-400 mt-0.5">by {log.actor?.fullName || 'System'}</p>
            </div>
            <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-gray-500 text-sm p-4">No audit records yet.</p>
        )}
      </div>
    </div>
  );
}
