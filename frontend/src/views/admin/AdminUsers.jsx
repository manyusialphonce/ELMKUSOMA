import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';

const ROLES = ['', 'STUDENT', 'TEACHER', 'PARENT', 'SCHOOL_ADMINISTRATOR', 'ADMINISTRATOR', 'SUPER_ADMINISTRATOR', 'ADVERTISER'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    adminApi.listUsers({ role: role || undefined, search: search || undefined })
      .then(({ data }) => setUsers(data.data))
      .catch(() => {});
  };

  useEffect(load, [role]);

  const handleToggle = async (user) => {
    setError('');
    try {
      if (user.accountStatus === 'SUSPENDED') {
        await adminApi.reactivateUser(user.id);
      } else {
        await adminApi.suspendUser(user.id);
      }
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update this user.');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Users</h1>
      <Alert type="error">{error}</Alert>

      <div className="flex gap-2 mb-4">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
          {ROLES.map((r) => <option key={r} value={r}>{r || 'All roles'}</option>)}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search by name..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        />
      </div>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {users.map((u) => (
          <div key={u.id} className="p-3 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{u.fullName}</p>
              <p className="text-xs text-gray-400">{u.email} · {u.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge status={u.accountStatus} />
              <button onClick={() => handleToggle(u)} className="text-xs font-medium text-blue-700">
                {u.accountStatus === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-sm text-gray-500 p-4">No users found.</p>}
      </div>
    </div>
  );
}
