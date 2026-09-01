import { useEffect, useState } from 'react';
import { resourcesApi } from '../../api/content';
import { educationApi } from '../../api/reference';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';

const TYPES = ['NOTES', 'BOOK', 'PAST_PAPER', 'SYLLABUS', 'REFERENCE_MATERIAL', 'TEACHER_GUIDE', 'DOCUMENT', 'REVISION_MATERIAL', 'OTHER'];

export default function TeacherResources() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    resourcesApi.mine().then(({ data }) => setResources(data.data)).catch(() => {});
  };

  useEffect(load, []);

  const handlePublish = async (id) => {
    setError('');
    try {
      await resourcesApi.publish(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not publish this resource.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Resources</h1>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'Add Resource'}</Button>
      </div>

      <Alert type="error">{error}</Alert>

      {showForm && <CreateResourceForm onCreated={() => { setShowForm(false); load(); }} />}

      <div className="space-y-2 mt-4">
        {resources.map((r) => (
          <div key={r.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900">{r.title}</h2>
                <Badge status={r.status} />
              </div>
              <p className="text-sm text-gray-500">{r.type} · {r.subject?.name}</p>
            </div>
            {r.status === 'DRAFT' && (
              <Button variant="secondary" onClick={() => handlePublish(r.id)}>Publish</Button>
            )}
          </div>
        ))}
        {resources.length === 0 && !showForm && (
          <p className="text-gray-500 text-sm">You haven't uploaded any resources yet.</p>
        )}
      </div>
    </div>
  );
}

function CreateResourceForm({ onCreated }) {
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [educationLevelId, setEducationLevelId] = useState('');
  const [form, setForm] = useState({ title: '', description: '', type: 'NOTES', subjectId: '', storageKey: '' });
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
      await resourcesApi.create({ ...form, educationLevelId });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add this resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <Alert type="error">{error}</Alert>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Type</span>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Education level</span>
        <select value={educationLevelId} onChange={(e) => setEducationLevelId(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">Select...</option>
          {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Subject</span>
        <select
          value={form.subjectId}
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
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
        label="File key / URL"
        value={form.storageKey}
        onChange={(e) => setForm({ ...form, storageKey: e.target.value })}
        required
        placeholder="e.g. resources/2026/notes.pdf"
      />
      <p className="text-xs text-gray-400 -mt-3 mb-4">
        A file upload flow isn't wired up yet — for now, paste the storage key or URL where the file already lives.
      </p>

      <Button type="submit" loading={loading}>Add Resource</Button>
    </form>
  );
}
