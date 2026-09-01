import { useEffect, useState } from 'react';
import useAuthStore from '../../stores/authStore';
import { reportsApi } from '../../api/reports';
import Alert from '../../components/common/Alert';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const [report, setReport] = useState(null);

  useEffect(() => {
    reportsApi.studentReport().then(({ data }) => setReport(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Karibu, {user?.fullName}</h1>
      <p className="text-gray-500 text-sm mb-6">Here's what's happening in your learning space.</p>

      {!user?.hasActiveSubscription && (
        <Alert type="warning">
          You don't have an active subscription yet.{' '}
          <Link to="/dashboard/subscription" className="underline font-medium">
            Subscribe now
          </Link>{' '}
          to access live classes, quizzes, and premium resources.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <SummaryCard title="Lessons Completed" value={report?.lessonsCompleted ?? '—'} />
        <SummaryCard title="Assignments Submitted" value={report?.assignmentsSubmitted ?? '—'} />
        <SummaryCard
          title="Average Quiz Score"
          value={report?.averageQuizScore != null ? report.averageQuizScore.toFixed(1) : '—'}
        />
        <SummaryCard title="Certificates Earned" value={report?.certificatesEarned ?? '—'} />
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
