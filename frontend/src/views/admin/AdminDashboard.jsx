import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { reportsApi } from '../../api/reports';

const PIE_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [geography, setGeography] = useState(null);

  useEffect(() => {
    reportsApi.adminOverview().then(({ data }) => setOverview(data.data)).catch(() => {});
    reportsApi.adminGeography().then(({ data }) => setGeography(data.data)).catch(() => {});
  }, []);

  const userSplit = overview ? [
    { name: 'Students', value: overview.users.students },
    { name: 'Teachers', value: overview.users.teachers },
    { name: 'Parents', value: overview.users.parents },
  ].filter((d) => d.value > 0) : [];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Platform-wide overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <SummaryCard title="Total Users" value={overview?.users?.total} />
        <SummaryCard title="Active Subscriptions" value={overview?.subscriptions?.active} />
        <SummaryCard title="Schools" value={overview?.schools} />
        <SummaryCard title="Pending Teacher Verifications" value={overview?.pendingTeacherVerifications} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard title="Live Classes Held" value={overview?.liveClassesHeld} />
        <SummaryCard title="Quiz Attempts" value={overview?.quizAttemptsCount} />
        <SummaryCard title="Certificates Issued" value={overview?.certificatesIssued} />
        <SummaryCard
          title="Total Revenue"
          value={overview ? `${Number(overview.totalRevenue).toLocaleString()} TZS` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Users by Role</h2>
          {userSplit.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={userSplit} dataKey="value" nameKey="name" outerRadius={80} label>
                  {userSplit.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400">No data yet.</p>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Users by Region</h2>
          {geography?.usersByRegion?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={geography.usersByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400">No data yet.</p>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Schools by Region</h2>
          {geography?.schoolsByRegion?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={geography.schoolsByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400">No data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? '—'}</p>
    </div>
  );
}
