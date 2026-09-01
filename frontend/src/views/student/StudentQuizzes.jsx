import { useEffect, useState } from 'react';
import { quizzesApi } from '../../api/assessments';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    quizzesApi.list().then(({ data }) => setQuizzes(data.data)).catch(() => {});
  };

  useEffect(load, []);

  const handleOpen = async (id) => {
    setError('');
    try {
      const { data } = await quizzesApi.get(id);
      setActiveQuiz(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this quiz.');
    }
  };

  if (activeQuiz) {
    return (
      <QuizAttempt
        quiz={activeQuiz}
        onDone={() => { setActiveQuiz(null); load(); }}
        onCancel={() => setActiveQuiz(null)}
      />
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">My Quizzes</h1>
      <Alert type="error">{error}</Alert>

      <div className="space-y-3">
        {quizzes.map((q) => {
          const usedUp = q.myAttemptsCount >= q.attemptLimit;
          return (
            <div key={q.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{q.title}</h2>
                <p className="text-sm text-gray-500">
                  {q.subject?.name} · {q._count?.questions} questions
                  {q.myAttemptsCount > 0 && ` · Best score: ${q.myBestScore}`}
                </p>
              </div>
              <Button onClick={() => handleOpen(q.id)} disabled={usedUp}>
                {usedUp ? 'Attempts Used' : q.myAttemptsCount > 0 ? 'Retake' : 'Take Quiz'}
              </Button>
            </div>
          );
        })}
        {quizzes.length === 0 && (
          <p className="text-gray-500 text-sm">No quizzes available right now.</p>
        )}
      </div>
    </div>
  );
}

function QuizAttempt({ quiz, onDone, onCancel }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setAnswer = (questionId, value) => setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([quizQuestionId, answerText]) => ({
        quizQuestionId: Number(quizQuestionId),
        answerText,
      }));
      const { data } = await quizzesApi.submitAttempt(quiz.id, payload);
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your answers.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Quiz submitted!</h1>
        <p className="text-3xl font-bold text-blue-700 mb-4">{result.score} points</p>
        <Button onClick={onDone}>Back to Quizzes</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <h1 className="text-xl font-bold text-gray-900 mb-1">{quiz.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{quiz.subject?.name}</p>

      <Alert type="error">{error}</Alert>

      <div className="space-y-6">
        {quiz.questions.map((q, i) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4">
            <p className="font-medium text-gray-900 mb-3">{i + 1}. {q.questionText}</p>

            {q.type === 'MULTIPLE_CHOICE' && Array.isArray(q.options) && (
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <label key={j} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === opt.text}
                      onChange={() => setAnswer(q.id, opt.text)}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'TRUE_FALSE' && (
              <div className="space-y-2">
                {['True', 'False'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswer(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'SHORT_ANSWER' && (
              <input
                value={answers[q.id] || ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Your answer"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>Submit Quiz</Button>
      </div>
    </form>
  );
}
