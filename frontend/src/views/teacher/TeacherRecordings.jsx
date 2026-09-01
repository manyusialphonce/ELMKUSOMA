import { useEffect, useState } from 'react';
import { recordingsApi } from '../../api/content';
import { educationApi } from '../../api/reference';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';

export default function TeacherRecordings() {
  const [recordings, setRecordings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    recordingsApi.mine().then(({ data }) => setRecordings(data.data)).catch(() => {});
  };

  useEffect(load, []);

  const handlePublish = async (id) => {
    setError('');
    try {
      await recordingsApi.publish(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not publish this recording.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Recordings</h1>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'Add Recording'}</Button>
      </div>

      <Alert type="error">{error}</Alert>

      {showForm && <CreateRecordingForm onCreated={() => { setShowForm(false); load(); }} />}

      <div className="space-y-2 mt-4">
        {recordings.map((r) => (
          <div key={r.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900">{r.title}</h2>
                <Badge status={r.status} />
              </div>
              <p className="text-sm text-gray-500">{r.subject?.name} · {r.educationLevel?.name}</p>
            </div>
            {r.status === 'DRAFT' && (
              <Button variant="secondary" onClick={() => handlePublish(r.id)}>Publish</Button>
            )}
          </div>
        ))}
        {recordings.length === 0 && !showForm && (
          <p className="text-gray-500 text-sm">You haven't uploaded any recordings yet.</p>
        )}
      </div>
    </div>
  );
}

function CreateRecordingForm({ onCreated }) {
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [educationLevelId, setEducationLevelId] = useState('');
  const [form, setForm] = useState({ title: '', description: '', subjectId: '', storageKey: '' });
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
      await recordingsApi.create({ ...form, educationLevelId });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add this recording.');
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
      <TextField
        label="Video file key / URL"
        value={form.storageKey}
        onChange={(e) => setForm({ ...form, storageKey: e.target.value })}
        required
        placeholder="e.g. recordings/2026/lesson1.mp4"
      />
      <p className="text-xs text-gray-400 -mt-3 mb-4">
        A file upload flow isn't wired up yet — for now, paste the storage key or URL where the video already lives.
      </p>

      <Button type="submit" loading={loading}>Add Recording</Button>
    </form>
  );
}
