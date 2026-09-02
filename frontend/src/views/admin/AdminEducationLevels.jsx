import { useEffect, useState } from 'react';
import { educationApi } from '../../api/reference';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function AdminEducationLevels() {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  const loadLevels = () => {
    educationApi.levels().then(({ data }) => setLevels(data.data)).catch(() => {});
  };

  useEffect(loadLevels, []);

  useEffect(() => {
    if (!selectedLevel) return;
    educationApi.classesForLevel(selectedLevel.id).then(({ data }) => setClasses(data.data)).catch(() => {});
  }, [selectedLevel]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Education Levels & Classes</h1>
      <Alert type="error">{error}</Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Education Levels</h2>
          <AddLevelForm onAdded={loadLevels} setError={setError} />
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mt-3">
            {levels.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLevel(l)}
                className={`w-full text-left p-3 text-sm ${selectedLevel?.id === l.id ? 'bg-blue-50' : ''}`}
              >
                {l.name}
              </button>
            ))}
            {levels.length === 0 && <p className="text-sm text-gray-500 p-3">No education levels yet.</p>}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Classes {selectedLevel && `in ${selectedLevel.name}`}
          </h2>
          {selectedLevel ? (
            <>
              <AddClassForm
                educationLevelId={selectedLevel.id}
                onAdded={() => educationApi.classesForLevel(selectedLevel.id).then(({ data }) => setClasses(data.data))}
                setError={setError}
              />
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mt-3">
                {classes.map((c) => (
                  <div key={c.id} className="p-3 text-sm">{c.name}</div>
                ))}
                {classes.length === 0 && <p className="text-sm text-gray-500 p-3">No classes yet.</p>}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">Select an education level to manage its classes.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AddLevelForm({ onAdded, setError }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await educationApi.createLevel({ name });
      setName('');
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add education level.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New education level"
        required
        className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm"
      />
      <Button type="submit" loading={loading}>Add</Button>
    </form>
  );
}

function AddClassForm({ educationLevelId, onAdded, setError }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await educationApi.createClass({ name, educationLevelId });
      setName('');
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New class (e.g. Form 3)"
        required
        className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm"
      />
      <Button type="submit" loading={loading}>Add</Button>
    </form>
  );
}
