import { useEffect, useState } from 'react';
import { assignmentsApi } from '../../api/assessments';
import { educationApi } from '../../api/reference';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import useAuthStore from '../../stores/authStore';

export default function TeacherAssignments() {
  const user = useAuthStore((s) => s.user);
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewingId, setViewingId] = useState(null);

  const load = () => {
    assignmentsApi.list({ teacherId: user.id }).then(({ data }) => setAssignments(data.data)).catch(() => {});
  };

  useEffect(load, [user.id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Assignments</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'Create Assignment'}
        </Button>
      </div>

      {showForm && <CreateAssignmentForm onCreated={() => { setShowForm(false); load(); }} />}

      <div className="space-y-2 mt-4">
        {assignments.map((a) => (
          <div key={a.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-900">{a.title}</h2>
                <p className="text-sm text-gray-500">
                  {a.subject?.name} · Due {new Date(a.deadline).toLocaleString()} · {a._count?.submissions} submissions
                </p>
              </div>
              <Button variant="secondary" onClick={() => setViewingId(viewingId === a.id ? null : a.id)}>
                {viewingId === a.id ? 'Hide Submissions' : 'View Submissions'}
              </Button>
            </div>

            {viewingId === a.id && <SubmissionsPanel assignmentId={a.id} maxScore={a.maxScore} />}
          </div>
        ))}
        {assignments.length === 0 && !showForm && (
          <p className="text-gray-500 text-sm">You haven't created any assignments yet.</p>
        )}
      </div>
    </div>
  );
}

function CreateAssignmentForm({ onCreated }) {
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [educationLevelId, setEducationLevelId] = useState('');
  const [form, setForm] = useState({
    subjectId: '', title: '', description: '', instructions: '', deadline: '', maxScore: 100,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    educationApi.levels().then(({ data }) => setLevels(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!educationLevelId) return;
    educationApi.subjects(educationLevelId).then(({ data }) => setSubjects(data.data)).catch(() => {});
  }, [educationLevelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await assignmentsApi.create(form);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <Alert type="error">{error}</Alert>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Education level</span>
        <select value={educationLevelId} onChange={(e) => setEducationLevelId(e.target.value)} required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">Select...</option>
          {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Subject</span>
        <select
          value={form.subjectId}
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
          required
          disabled={!educationLevelId}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select...</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>

      <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <TextField label="Instructions" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
      <TextField label="Deadline" type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
      <TextField label="Max score" type="number" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: e.target.value })} />

      <Button type="submit" loading={loading}>Create Assignment</Button>
    </form>
  );
}

function SubmissionsPanel({ assignmentId, maxScore }) {
  const [submissions, setSubmissions] = useState([]);

  const load = () => {
    assignmentsApi.listSubmissions(assignmentId).then(({ data }) => setSubmissions(data.data)).catch(() => {});
  };

  useEffect(load, [assignmentId]);

  const handleGrade = async (submissionId) => {
    const score = window.prompt(`Score (out of ${maxScore}):`);
    if (score === null) return;
    const teacherComment = window.prompt('Comment (optional):') || undefined;
    try {
      await assignmentsApi.grade(submissionId, { score: Number(score), teacherComment });
      load();
    } catch {
      // silent — could surface an Alert here
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
      {submissions.map((s) => (
        <div key={s.id} className="flex items-center justify-between text-sm bg-white border border-gray-100 rounded-md p-2">
          <div>
            <span className="font-medium">{s.student?.fullName}</span>
            <Badge status={s.status} />
            {s.score !== null && <span className="ml-2 text-gray-600">Score: {s.score}/{maxScore}</span>}
          </div>
          {s.status !== 'GRADED' && s.status !== 'NOT_SUBMITTED' && (
            <button onClick={() => handleGrade(s.id)} className="text-blue-700">Grade</button>
          )}
        </div>
      ))}
      {submissions.length === 0 && <p className="text-sm text-gray-400">No submissions yet.</p>}
    </div>
  );
}
