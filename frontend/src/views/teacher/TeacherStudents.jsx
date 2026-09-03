import { useEffect, useState } from 'react';
import { reportsApi } from '../../api/reports';

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    reportsApi.teacherStudents().then(({ data }) => setStudents(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">My Students</h1>
      <p className="text-gray-500 text-sm mb-6">
        Students who have attended your live classes, taken your quizzes, or submitted your assignments.
      </p>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {students.map((s) => (
          <div key={s.id} className="p-3 text-sm">
            <p className="font-medium text-gray-900">{s.fullName}</p>
            <p className="text-xs text-gray-400">{s.email}</p>
          </div>
        ))}
        {students.length === 0 && (
          <p className="text-sm text-gray-500 p-4">No students have interacted with your content yet.</p>
        )}
      </div>
    </div>
  );
}
