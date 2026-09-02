import { useEffect, useState } from 'react';
import { educationApi } from '../../api/reference';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    educationApi.subjects().then(({ data }) => setSubjects(data.data)).catch(() => {});
  };

  useEffect(() => {
    load();
    educationApi.levels().then(({ data }) => setLevels(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Subjects</h1>
      <Alert type="error">{error}</Alert>

      <AddSubjectForm levels={levels} onAdded={load} setError={setError} />

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mt-4">
        {subjects.map((s) => (
          <div key={s.id} className="p-3 text-sm">
            <p className="font-medium text-gray-900">{s.name}</p>
            {s.educationLevels?.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {s.educationLevels.map((el) => el.educationLevel.name).join(', ')}
              </p>
            )}
          </div>
        ))}
        {subjects.length === 0 && <p className="text-sm text-gray-500 p-3">No subjects yet.</p>}
      </div>
    </div>
  );
}

function AddSubjectForm({ levels, onAdded, setError }) {
  const [name, setName] = useState('');
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleLevel = (id) => {
    setSelectedLevels((prev) => (prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await educationApi.createSubject({ name, educationLevelIds: selectedLevels });
      setName('');
      setSelectedLevels([]);
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add subject.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex gap-2 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New subject name"
          required
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <Button type="submit" loading={loading}>Add Subject</Button>
      </div>
      <p className="text-xs text-gray-500 mb-2">Apply to education levels (optional):</p>
      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <label key={l.id} className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1">
            <input
              type="checkbox"
              checked={selectedLevels.includes(l.id)}
              onChange={() => toggleLevel(l.id)}
            />
            {l.name}
          </label>
        ))}
      </div>
    </form>
  );
}
