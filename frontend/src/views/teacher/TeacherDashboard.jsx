import { useEffect, useState } from 'react';
import useAuthStore from '../../stores/authStore';
import { reportsApi } from '../../api/reports';
import Alert from '../../components/common/Alert';

export default function TeacherDashboard() {
  const user = useAuthStore((s) => s.user);
  const isVerified = user?.verificationStatus === 'VERIFIED';
  const [report, setReport] = useState(null);

  useEffect(() => {
    reportsApi.teacherReport().then(({ data }) => setReport(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Karibu, {user?.fullName}</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your classes, students, and content.</p>

      {!isVerified && (
        <Alert type="warning">
          Your identity verification is <strong>{user?.verificationStatus?.toLowerCase() || 'pending'}</strong>.
          You cannot create live classes, upload recordings, or publish resources until verified.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <SummaryCard title="Live Classes Held" value={report?.liveClassesHeld ?? '—'} />
        <SummaryCard title="Unique Students Reached" value={report?.uniqueStudentsReached ?? '—'} />
        <SummaryCard title="Quizzes Created" value={report?.quizzesCreated ?? '—'} />
        <SummaryCard
          title="Avg. Student Score"
          value={report?.averageStudentQuizScore != null ? report.averageStudentQuizScore.toFixed(1) : '—'}
        />
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
