import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    adminApi.listSettings().then(({ data }) => setSettings(data.data)).catch(() => {});
  };

  useEffect(load, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Platform-wide configuration (Super Administrator only can edit).</p>

      <Alert type="error">{error}</Alert>

      <AddSettingForm onAdded={load} setError={setError} />

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mt-4">
        {settings.map((s) => (
          <SettingRow key={s.id} setting={s} onSaved={load} setError={setError} />
        ))}
        {settings.length === 0 && <p className="text-sm text-gray-500 p-3">No settings configured yet.</p>}
      </div>
    </div>
  );
}

function SettingRow({ setting, onSaved, setError }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(JSON.stringify(setting.value));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const parsed = JSON.parse(value);
      await adminApi.updateSetting(setting.key, parsed);
      setEditing(false);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid value — must be valid JSON (e.g. "text", 123, true, {"a":1}).');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 text-sm flex items-center justify-between gap-4">
      <span className="font-mono text-gray-700 shrink-0">{setting.key}</span>
      {editing ? (
        <div className="flex-1 flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm font-mono"
          />
          <button onClick={handleSave} disabled={saving} className="text-blue-700 font-medium text-xs">Save</button>
          <button onClick={() => setEditing(false)} className="text-gray-400 text-xs">Cancel</button>
        </div>
      ) : (
        <>
          <span className="flex-1 text-gray-500 truncate">{JSON.stringify(setting.value)}</span>
          <button onClick={() => setEditing(true)} className="text-blue-700 text-xs font-medium shrink-0">Edit</button>
        </>
      )}
    </div>
  );
}

function AddSettingForm({ onAdded, setError }) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const parsed = JSON.parse(value);
      await adminApi.updateSetting(key, parsed);
      setKey('');
      setValue('');
      onAdded();
    } catch (err) {
      setError(
        err instanceof SyntaxError
          ? 'Value must be valid JSON — wrap text in quotes, e.g. "some text".'
          : err.response?.data?.message || 'Could not save this setting.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Setting key (e.g. platform_name)"
        required
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Value as JSON, e.g. "ELMKUSOMA"'
        required
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
      />
      <Button type="submit" loading={loading}>Save</Button>
    </form>
  );
}
