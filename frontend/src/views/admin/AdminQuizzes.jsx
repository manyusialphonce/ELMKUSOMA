import { useEffect, useState } from 'react';
import { quizzesApi } from '../../api/assessments';

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    quizzesApi.list().then(({ data }) => setQuizzes(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Quizzes</h1>
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {quizzes.map((q) => (
          <div key={q.id} className="p-3 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{q.title}</p>
              <p className="text-xs text-gray-400">{q.teacher?.fullName} · {q.subject?.name}</p>
            </div>
            <span className="text-xs text-gray-500">
              {q._count?.questions} questions · {q._count?.attempts} attempts
            </span>
          </div>
        ))}
        {quizzes.length === 0 && <p className="text-sm text-gray-500 p-4">No quizzes found.</p>}
      </div>
    </div>
  );
}
