import { useEffect, useState } from 'react';
import { reportsApi } from '../../api/reports';
import { quizzesApi } from '../../api/assessments';

export default function StudentResults() {
  const [report, setReport] = useState(null);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    reportsApi.studentReport().then(({ data }) => setReport(data.data)).catch(() => {});
    quizzesApi.myAttempts().then(({ data }) => setAttempts(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Results</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard title="Lessons Completed" value={report?.lessonsCompleted} />
        <SummaryCard title="Assignments Submitted" value={report?.assignmentsSubmitted} />
        <SummaryCard
          title="Average Quiz Score"
          value={report?.averageQuizScore != null ? report.averageQuizScore.toFixed(1) : undefined}
        />
        <SummaryCard title="Certificates Earned" value={report?.certificatesEarned} />
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mb-3">Quiz Attempt History</h2>
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {attempts.map((a) => (
          <div key={a.id} className="p-3 text-sm flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{a.quiz.title}</p>
              <p className="text-xs text-gray-400">{a.quiz.subject?.name}</p>
            </div>
            <span className={`font-semibold ${a.quiz.passingScore && a.score < a.quiz.passingScore ? 'text-red-600' : 'text-green-700'}`}>
              {a.score ?? '—'}
            </span>
          </div>
        ))}
        {attempts.length === 0 && (
          <p className="text-sm text-gray-500 p-4">No quiz attempts yet.</p>
        )}
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
