import { useEffect, useState } from 'react';
import { liveClassesApi, questionsApi } from '../../api/liveClasses';
import { educationApi } from '../../api/reference';
import useLiveClassSocket from '../../hooks/useLiveClassSocket';
import useAgoraClient from '../../hooks/useAgoraClient';
import LiveVideoStage from '../../components/common/LiveVideoStage';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import Alert from '../../components/common/Alert';
import useAuthStore from '../../stores/authStore';

export default function TeacherLiveClasses() {
  const user = useAuthStore((s) => s.user);
  const [liveClasses, setLiveClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState('');
  const agora = useAgoraClient();

  const load = () => {
    liveClassesApi.list({ teacherId: user.id }).then(({ data }) => setLiveClasses(data.data)).catch(() => {});
  };

  useEffect(load, [user.id]);

  const handleStart = async (id) => {
    setError('');
    try {
      const { data } = await liveClassesApi.start(id);
      if (data.streaming) {
        setSelectedId(id);
        await agora.join(data.streaming, true, 'teacher-local-video');
      } else {
        setError('Class started, but streaming credentials are not configured yet (set AGORA_APP_ID/AGORA_APP_CERTIFICATE on the backend).');
      }
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start the class.');
    }
  };

  const handleEnd = async (id) => {
    setError('');
    try {
      await agora.leave();
      await liveClassesApi.end(id);
      if (selectedId === id) setSelectedId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not end the class.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">My Live Classes</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'Schedule a Live Class'}
        </Button>
      </div>

      <Alert type="error">{error || agora.error}</Alert>

      {showForm && (
        <CreateLiveClassForm
          onCreated={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      <div className="space-y-3 mt-4">
        {liveClasses.map((lc) => (
          <div key={lc.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-gray-900">{lc.topic}</h2>
                  <Badge status={lc.status} />
                </div>
                <p className="text-sm text-gray-500">
                  {lc.subject?.name} · {new Date(lc.startTime).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                {lc.status === 'SCHEDULED' && (
                  <Button onClick={() => handleStart(lc.id)}>Start</Button>
                )}
                {lc.status === 'LIVE' && (
                  <>
                    <Button variant="secondary" onClick={() => setSelectedId(selectedId === lc.id ? null : lc.id)}>
                      {selectedId === lc.id ? 'Hide' : 'Open'} Class
                    </Button>
                    <Button variant="danger" onClick={() => handleEnd(lc.id)}>End</Button>
                  </>
                )}
              </div>
            </div>

            {selectedId === lc.id && lc.status === 'LIVE' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <LiveVideoStage
                  isPublisher
                  localVideoElementId="teacher-local-video"
                  remoteUsers={agora.remoteUsers}
                  status={agora.status}
                />
                {agora.status === 'connected' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setMicOn(!micOn); agora.toggleMic(!micOn); }}
                      className="text-xs px-3 py-1 rounded-md border border-gray-300"
                    >
                      {micOn ? 'Mute Mic' : 'Unmute Mic'}
                    </button>
                    <button
                      onClick={() => { setCamOn(!camOn); agora.toggleCamera(!camOn); }}
                      className="text-xs px-3 py-1 rounded-md border border-gray-300"
                    >
                      {camOn ? 'Turn Off Camera' : 'Turn On Camera'}
                    </button>
                  </div>
                )}
                <QuestionsPanel liveClassId={lc.id} />
              </div>
            )}
          </div>
        ))}

        {liveClasses.length === 0 && !showForm && (
          <p className="text-gray-500 text-sm">You haven't scheduled any live classes yet.</p>
        )}
      </div>
    </div>
  );
}

function CreateLiveClassForm({ onCreated }) {
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    subjectId: '', educationLevelId: '', topic: '', description: '',
    startTime: '', durationMinutes: 60, questionsEnabled: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    educationApi.levels().then(({ data }) => setLevels(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.educationLevelId) return;
    educationApi.subjects(form.educationLevelId).then(({ data }) => setSubjects(data.data)).catch(() => {});
  }, [form.educationLevelId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await liveClassesApi.create(form);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the live class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <Alert type="error">{error}</Alert>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Education level</span>
        <select
          name="educationLevelId"
          value={form.educationLevelId}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select...</option>
          {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Subject</span>
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          required
          disabled={!form.educationLevelId}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select...</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>

      <TextField label="Topic" name="topic" value={form.topic} onChange={handleChange} required />
      <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
      <TextField
        label="Start time"
        type="datetime-local"
        name="startTime"
        value={form.startTime}
        onChange={handleChange}
        required
      />
      <TextField
        label="Duration (minutes)"
        type="number"
        name="durationMinutes"
        value={form.durationMinutes}
        onChange={handleChange}
        required
      />

      <label className="flex items-center gap-2 mb-4 text-sm text-gray-700">
        <input type="checkbox" name="questionsEnabled" checked={form.questionsEnabled} onChange={handleChange} />
        Allow students to ask questions during this class
      </label>

      <Button type="submit" loading={loading}>Schedule Class</Button>
    </form>
  );
}

function QuestionsPanel({ liveClassId }) {
  const [questions, setQuestions] = useState([]);

  const load = () => {
    liveClassesApi.listQuestions(liveClassId).then(({ data }) => setQuestions(data.data)).catch(() => {});
  };

  useEffect(load, [liveClassId]);

  useLiveClassSocket(liveClassId, {
    'question:requested': (q) => setQuestions((prev) => [...prev, q]),
    'question:updated': (updated) =>
      setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q))),
  });

  const handleApprove = (id) => questionsApi.approve(id).catch(() => {});
  const handleReject = (id) => questionsApi.reject(id).catch(() => {});
  const handleAnswer = (id) => {
    const answer = window.prompt('Your answer:');
    if (answer) questionsApi.answer(id, answer).catch(() => {});
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Student Questions (live)</h3>
      {questions.length === 0 && <p className="text-sm text-gray-400">No questions yet.</p>}
      {questions.map((q) => (
        <div key={q.id} className="flex items-center justify-between text-sm bg-white border border-gray-100 rounded-md p-2">
          <div>
            <span className="font-medium">{q.student?.fullName}</span>
            {q.question && <span className="text-gray-600"> — {q.question}</span>}
            {q.answer && <p className="text-green-700 mt-1">Answer: {q.answer}</p>}
          </div>
          <div className="flex gap-2">
            {q.status === 'PENDING' && (
              <>
                <button onClick={() => handleApprove(q.id)} className="text-green-700">Approve</button>
                <button onClick={() => handleReject(q.id)} className="text-red-600">Reject</button>
              </>
            )}
            {q.status === 'APPROVED' && (
              <button onClick={() => handleAnswer(q.id)} className="text-blue-700">Answer</button>
            )}
            <Badge status={q.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
