import { useEffect, useState } from 'react';
import { parentsApi } from '../../api/parents';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = () => {
    parentsApi.listChildren().then(({ data }) => setChildren(data.data)).catch(() => {});
  };

  useEffect(load, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">My Children</h1>
        <Button onClick={() => setShowLinkForm((s) => !s)}>
          {showLinkForm ? 'Cancel' : 'Link a Child'}
        </Button>
      </div>

      {showLinkForm && (
        <LinkChildForm onLinked={() => { setShowLinkForm(false); load(); }} />
      )}

      <div className="space-y-3 mt-4">
        {children.map((link) => (
          <div key={link.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{link.student.fullName}</h2>
                <p className="text-sm text-gray-500">
                  {link.relationship || 'Guardian'} · {link.student.educationLevel?.name || 'No level set'}
                  {link.student.school && ` · ${link.student.school.name}`}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setExpandedId(expandedId === link.studentId ? null : link.studentId)}
              >
                {expandedId === link.studentId ? 'Hide Details' : 'View Progress'}
              </Button>
            </div>

            {expandedId === link.studentId && <ChildProgressPanel studentId={link.studentId} />}
          </div>
        ))}

        {children.length === 0 && !showLinkForm && (
          <p className="text-gray-500 text-sm">No children linked yet.</p>
        )}
      </div>
    </div>
  );
}

function LinkChildForm({ onLinked }) {
  const [studentEmail, setStudentEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await parentsApi.linkChild({ studentEmail, relationship });
      onLinked();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not link this child.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <Alert type="error">{error}</Alert>
      <TextField
        label="Child's account email"
        type="email"
        value={studentEmail}
        onChange={(e) => setStudentEmail(e.target.value)}
        required
      />
      <TextField
        label="Relationship (e.g. Mother, Father, Guardian)"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
      />
      <Button type="submit" loading={loading}>Link Child</Button>
    </form>
  );
}

function ChildProgressPanel({ studentId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    parentsApi.childProgress(studentId).then(({ data }) => setData(data.data)).catch(() => {});
  }, [studentId]);

  if (!data) return <p className="text-sm text-gray-400 mt-4">Loading...</p>;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Recent Lesson Progress</h3>
        {data.lessonProgress.map((p) => (
          <div key={p.id} className="flex justify-between py-1">
            <span>{p.lesson.title}</span>
            <span className="text-gray-500">{p.progressPercent}%</span>
          </div>
        ))}
        {data.lessonProgress.length === 0 && <p className="text-gray-400">No lessons started yet.</p>}
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Recent Quiz Results</h3>
        {data.quizAttempts.map((a) => (
          <div key={a.id} className="flex justify-between py-1">
            <span>{a.quiz.title}</span>
            <span className="text-gray-500">{a.score ?? '—'}</span>
          </div>
        ))}
        {data.quizAttempts.length === 0 && <p className="text-gray-400">No quiz attempts yet.</p>}
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Assignment Submissions</h3>
        {data.submissions.map((s) => (
          <div key={s.id} className="flex justify-between items-center py-1">
            <span>{s.assignment.title}</span>
            <Badge status={s.status} />
          </div>
        ))}
        {data.submissions.length === 0 && <p className="text-gray-400">No submissions yet.</p>}
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Live Class Attendance</h3>
        {data.attendances.map((a) => (
          <div key={a.id} className="flex justify-between py-1">
            <span>{a.liveClass.topic}</span>
            <span className="text-gray-500">{new Date(a.liveClass.startTime).toLocaleDateString()}</span>
          </div>
        ))}
        {data.attendances.length === 0 && <p className="text-gray-400">No attendance records yet.</p>}
      </div>
    </div>
  );
}
