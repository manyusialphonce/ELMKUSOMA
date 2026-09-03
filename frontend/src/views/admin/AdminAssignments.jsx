import { useEffect, useState } from 'react';
import { assignmentsApi } from '../../api/assessments';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    assignmentsApi.list().then(({ data }) => setAssignments(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Assignments</h1>
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {assignments.map((a) => (
          <div key={a.id} className="p-3 text-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{a.title}</p>
              <p className="text-xs text-gray-400">
                {a.teacher?.fullName} · {a.subject?.name} · Due {new Date(a.deadline).toLocaleDateString()}
              </p>
            </div>
            <span className="text-xs text-gray-500">{a._count?.submissions} submissions</span>
          </div>
        ))}
        {assignments.length === 0 && <p className="text-sm text-gray-500 p-4">No assignments found.</p>}
      </div>
    </div>
  );
}
