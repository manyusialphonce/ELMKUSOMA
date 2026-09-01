import { useEffect, useState } from 'react';
import { quizzesApi } from '../../api/assessments';
import { educationApi } from '../../api/reference';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import Alert from '../../components/common/Alert';
import useAuthStore from '../../stores/authStore';

const emptyQuestion = () => ({ type: 'MULTIPLE_CHOICE', questionText: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }], correctAnswer: '', points: 1 });

export default function TeacherQuizzes() {
  const user = useAuthStore((s) => s.user);
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    quizzesApi.list({ teacherId: user.id }).then(({ data }) => setQuizzes(data.data)).catch(() => {});
  };

  useEffect(load, [user.id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Quizzes</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'Create Quiz'}
        </Button>
      </div>

      {showForm && (
        <CreateQuizForm onCreated={() => { setShowForm(false); load(); }} />
      )}

      <div className="space-y-2 mt-4">
        {quizzes.map((q) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-900">{q.title}</h2>
              <p className="text-sm text-gray-500">
                {q.subject?.name} · {q._count?.questions} questions · {q._count?.attempts} attempts
              </p>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && !showForm && (
          <p className="text-gray-500 text-sm">You haven't created any quizzes yet.</p>
        )}
      </div>
    </div>
  );
}

function CreateQuizForm({ onCreated }) {
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [educationLevelId, setEducationLevelId] = useState('');
  const [form, setForm] = useState({
    subjectId: '', title: '', description: '', timeLimitMins: '', attemptLimit: 1, passingScore: '',
  });
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    educationApi.levels().then(({ data }) => setLevels(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!educationLevelId) return;
    educationApi.subjects(educationLevelId).then(({ data }) => setSubjects(data.data)).catch(() => {});
  }, [educationLevelId]);

  const updateQuestion = (index, patch) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const updateOption = (qIndex, optIndex, patch) => {
    setQuestions((prev) => prev.map((q, i) => {
      if (i !== qIndex) return q;
      const options = q.options.map((o, j) => (j === optIndex ? { ...o, ...patch } : o));
      return { ...q, options };
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await quizzesApi.create({ ...form, questions });
      onCreated();
    } catch (err) {
      const message = err.response?.data?.errors
        ? err.response.data.errors.map((e) => e.msg).join(' ')
        : err.response?.data?.message || 'Could not create the quiz.';
      setError(message);
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
      <TextField label="Time limit (minutes, optional)" type="number" value={form.timeLimitMins} onChange={(e) => setForm({ ...form, timeLimitMins: e.target.value })} />
      <TextField label="Attempt limit" type="number" value={form.attemptLimit} onChange={(e) => setForm({ ...form, attemptLimit: e.target.value })} />

      <h3 className="text-sm font-semibold text-gray-700 mb-2 mt-6">Questions</h3>
      {questions.map((q, i) => (
        <div key={i} className="border border-gray-200 bg-white rounded-md p-3 mb-3">
          <div className="flex gap-2 mb-2">
            <select
              value={q.type}
              onChange={(e) => updateQuestion(i, { type: e.target.value })}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="SHORT_ANSWER">Short Answer</option>
            </select>
            <input
              placeholder="Points"
              type="number"
              value={q.points}
              onChange={(e) => updateQuestion(i, { points: Number(e.target.value) })}
              className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>

          <input
            placeholder="Question text"
            value={q.questionText}
            onChange={(e) => updateQuestion(i, { questionText: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm mb-2"
          />

          {q.type === 'MULTIPLE_CHOICE' && q.options.map((opt, j) => (
            <div key={j} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                checked={opt.isCorrect}
                onChange={() => updateQuestion(i, {
                  options: q.options.map((o, k) => ({ ...o, isCorrect: k === j })),
                })}
              />
              <input
                placeholder={`Option ${j + 1}`}
                value={opt.text}
                onChange={(e) => updateOption(i, j, { text: e.target.value })}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </div>
          ))}

          {(q.type === 'TRUE_FALSE' || q.type === 'SHORT_ANSWER') && (
            <input
              placeholder="Correct answer"
              value={q.correctAnswer}
              onChange={(e) => updateQuestion(i, { correctAnswer: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
        className="text-sm text-blue-700 font-medium mb-4"
      >
        + Add another question
      </button>

      <div>
        <Button type="submit" loading={loading}>Create Quiz</Button>
      </div>
    </form>
  );
}
