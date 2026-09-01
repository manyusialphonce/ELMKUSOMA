import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupDraftsApi } from '../../api/setupDrafts';
import { geographyApi } from '../../api/reference';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const STEPS = ['Basic Info', 'Location', 'Contact & Studio', 'Review'];

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function SchoolSetupWizard() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', slug: '', description: '',
    regionId: '', districtId: '', locationDetails: '',
    phoneNumber: '', email: '', website: '', hasStudio: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await setupDraftsApi.getActive('school');
        const active = data.data || (await setupDraftsApi.start('school')).data.data;
        setDraft(active);
        setForm((f) => ({ ...f, ...active.data }));
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load the setup wizard.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const currentStep = draft?.currentStep || 1;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let next = { ...form, [name]: type === 'checkbox' ? checked : value };
    if (name === 'name' && (!form.slug || form.slug === slugify(form.name))) {
      next.slug = slugify(value);
    }
    setForm(next);
  };

  const saveStep = async (stepFields, goToStep) => {
    setError('');
    setSaving(true);
    try {
      const payload = Object.fromEntries(stepFields.map((k) => [k, form[k]]));
      const { data } = await setupDraftsApi.update(draft.id, { currentStep: goToStep, data: payload });
      setDraft(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this step.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setError('');
    setSaving(true);
    try {
      await setupDraftsApi.update(draft.id, {
        data: { phoneNumber: form.phoneNumber, email: form.email, website: form.website, hasStudio: form.hasStudio },
      });
      const { data } = await setupDraftsApi.complete(draft.id);
      navigate(`/schools/${data.data.slug}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not finish setting up the school.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400 py-10">Loading setup wizard...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Set Up Your School</h1>
      <p className="text-gray-500 text-sm mb-6">
        You can leave and come back anytime — your progress is saved after each step.
      </p>

      <StepIndicator currentStep={currentStep} />

      <Alert type="error">{error}</Alert>

      <div className="border border-gray-200 rounded-lg p-6 mt-4">
        {currentStep === 1 && (
          <BasicInfoStep form={form} onChange={handleChange} onNext={() => saveStep(['name', 'slug', 'description'], 2)} saving={saving} />
        )}
        {currentStep === 2 && (
          <LocationStep
            form={form}
            onChange={handleChange}
            onBack={() => saveStep([], 1)}
            onNext={() => saveStep(['regionId', 'districtId', 'locationDetails'], 3)}
            saving={saving}
          />
        )}
        {currentStep === 3 && (
          <ContactStep
            form={form}
            onChange={handleChange}
            onBack={() => saveStep([], 2)}
            onNext={() => saveStep(['phoneNumber', 'email', 'website', 'hasStudio'], 4)}
            saving={saving}
          />
        )}
        {currentStep === 4 && (
          <ReviewStep form={form} onBack={() => saveStep([], 3)} onComplete={handleComplete} saving={saving} />
        )}
      </div>
    </div>
  );
}

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                isDone ? 'bg-green-600 text-white' : isActive ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {isDone ? '✓' : step}
            </div>
            <span className={`text-xs ${isActive ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {step < STEPS.length && <div className="flex-1 h-px bg-gray-200" />}
          </div>
        );
      })}
    </div>
  );
}

function BasicInfoStep({ form, onChange, onNext, saving }) {
  return (
    <div>
      <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
      <TextField label="School name" name="name" value={form.name} onChange={onChange} required />
      <TextField label="URL slug" name="slug" value={form.slug} onChange={onChange} required />
      <TextField label="Description" name="description" value={form.description} onChange={onChange} />
      <div className="flex justify-end">
        <Button onClick={onNext} loading={saving} disabled={!form.name || !form.slug}>
          Next
        </Button>
      </div>
    </div>
  );
}

function LocationStep({ form, onChange, onBack, onNext, saving }) {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    geographyApi.regions().then(({ data }) => setRegions(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.regionId) return;
    geographyApi.districts(form.regionId).then(({ data }) => setDistricts(data.data)).catch(() => {});
  }, [form.regionId]);

  return (
    <div>
      <h2 className="font-semibold text-gray-900 mb-4">Location</h2>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Region</span>
        <select
          name="regionId"
          value={form.regionId}
          onChange={onChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select...</option>
          {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">District</span>
        <select
          name="districtId"
          value={form.districtId}
          onChange={onChange}
          required
          disabled={!form.regionId}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select...</option>
          {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </label>

      <TextField label="Location details (street, landmark)" name="locationDetails" value={form.locationDetails} onChange={onChange} />

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} disabled={saving}>Back</Button>
        <Button onClick={onNext} loading={saving} disabled={!form.regionId || !form.districtId}>
          Next
        </Button>
      </div>
    </div>
  );
}

function ContactStep({ form, onChange, onBack, onNext, saving }) {
  return (
    <div>
      <h2 className="font-semibold text-gray-900 mb-4">Contact & Studio</h2>
      <TextField label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
      <TextField label="Email" type="email" name="email" value={form.email} onChange={onChange} />
      <TextField label="Website" name="website" value={form.website} onChange={onChange} />

      <label className="flex items-start gap-2 mb-4 text-sm text-gray-700">
        <input type="checkbox" name="hasStudio" checked={form.hasStudio} onChange={onChange} className="mt-0.5" />
        <span>
          This school has a studio for live streaming.
          <span className="block text-xs text-gray-400">
            Schools without a studio can still publish recorded lessons.
          </span>
        </span>
      </label>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} disabled={saving}>Back</Button>
        <Button onClick={onNext} loading={saving}>Next</Button>
      </div>
    </div>
  );
}

function ReviewStep({ form, onBack, onComplete, saving }) {
  return (
    <div>
      <h2 className="font-semibold text-gray-900 mb-4">Review & Confirm</h2>
      <dl className="space-y-2 text-sm mb-6">
        <Row label="Name" value={form.name} />
        <Row label="Slug" value={form.slug} />
        <Row label="Description" value={form.description || '—'} />
        <Row label="Location details" value={form.locationDetails || '—'} />
        <Row label="Phone" value={form.phoneNumber || '—'} />
        <Row label="Email" value={form.email || '—'} />
        <Row label="Website" value={form.website || '—'} />
        <Row label="Has studio" value={form.hasStudio ? 'Yes' : 'No'} />
      </dl>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} disabled={saving}>Back</Button>
        <Button onClick={onComplete} loading={saving}>Create School</Button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-1">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}
