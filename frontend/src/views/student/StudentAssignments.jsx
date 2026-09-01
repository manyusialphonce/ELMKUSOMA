import { useEffect, useState } from 'react';
import { assignmentsApi } from '../../api/assessments';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    assignmentsApi.list().then(({ data }) => setAssignments(data.data)).catch(() => {});
  };

  useEffect(load, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">My Assignments</h1>
      <Alert type="error">{error}</Alert>

      <div className="space-y-3">
        {assignments.map((a) => (
          <div key={a.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900">{a.title}</h2>
                  {a.mySubmission && <Badge status={a.mySubmission.status} />}
                </div>
                <p className="text-sm text-gray-500">
                  {a.subject?.name} · Due {new Date(a.deadline).toLocaleString()}
                  {a.mySubmission?.score != null && ` · Score: ${a.mySubmission.score}/${a.maxScore}`}
                </p>
              </div>
              <Button variant="secondary" onClick={() => setActiveId(activeId === a.id ? null : a.id)}>
                {activeId === a.id ? 'Close' : a.mySubmission ? 'View' : 'Submit'}
              </Button>
            </div>

            {activeId === a.id && (
              <SubmissionForm assignment={a} onSubmitted={() => { setActiveId(null); load(); }} setError={setError} />
            )}
          </div>
        ))}
        {assignments.length === 0 && (
          <p className="text-gray-500 text-sm">No assignments right now.</p>
        )}
      </div>
    </div>
  );
}

function SubmissionForm({ assignment, onSubmitted, setError }) {
  const [answerText, setAnswerText] = useState(assignment.mySubmission?.answerText || '');
  const [submitting, setSubmitting] = useState(false);
  const alreadySubmitted = Boolean(assignment.mySubmission?.submittedAt);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await assignmentsApi.submit(assignment.id, { answerText });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {assignment.instructions && (
        <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{assignment.instructions}</p>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={5}
          disabled={alreadySubmitted}
          placeholder="Write your answer here..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 disabled:bg-gray-50"
        />
        {assignment.mySubmission?.teacherComment && (
          <p className="text-sm text-green-700 mb-3">
            Teacher comment: {assignment.mySubmission.teacherComment}
          </p>
        )}
        {!alreadySubmitted && (
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        )}
      </form>
    </div>
  );
}
