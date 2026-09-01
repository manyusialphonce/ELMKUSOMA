import { useEffect, useState } from 'react';
import { reportsApi } from '../../api/reports';

export default function TeacherPerformance() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    reportsApi.teacherReport().then(({ data }) => setReport(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Performance</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard title="Live Classes Held" value={report?.liveClassesHeld} />
        <SummaryCard title="Recordings Published" value={report?.recordingsPublished} />
        <SummaryCard title="Lessons Published" value={report?.lessonsPublished} />
        <SummaryCard title="Quizzes Created" value={report?.quizzesCreated} />
        <SummaryCard title="Assignments Created" value={report?.assignmentsCreated} />
        <SummaryCard title="Unique Students Reached" value={report?.uniqueStudentsReached} />
        <SummaryCard
          title="Avg. Student Quiz Score"
          value={report?.averageStudentQuizScore != null ? report.averageStudentQuizScore.toFixed(1) : undefined}
        />
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
