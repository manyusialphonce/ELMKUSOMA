import { useEffect, useState } from 'react';
import { geographyApi } from '../../api/reference';
import Button from '../../components/common/Button';
import TextField from '../../components/common/TextField';
import Alert from '../../components/common/Alert';

export default function AdminRegions() {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState('');

  const loadRegions = () => {
    geographyApi.regions().then(({ data }) => setRegions(data.data)).catch(() => {});
  };

  useEffect(() => {
    geographyApi.countries().then(({ data }) => setCountries(data.data)).catch(() => {});
    loadRegions();
  }, []);

  useEffect(() => {
    if (!selectedRegion) return;
    geographyApi.districts(selectedRegion.id).then(({ data }) => setDistricts(data.data)).catch(() => {});
  }, [selectedRegion]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Regions & Districts</h1>
      <Alert type="error">{error}</Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Regions</h2>
          <AddRegionForm countries={countries} onAdded={loadRegions} setError={setError} />
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mt-3">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r)}
                className={`w-full text-left p-3 text-sm ${selectedRegion?.id === r.id ? 'bg-blue-50' : ''}`}
              >
                {r.name}
              </button>
            ))}
            {regions.length === 0 && <p className="text-sm text-gray-500 p-3">No regions yet.</p>}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Districts {selectedRegion && `in ${selectedRegion.name}`}
          </h2>
          {selectedRegion ? (
            <>
              <AddDistrictForm regionId={selectedRegion.id} onAdded={() => geographyApi.districts(selectedRegion.id).then(({ data }) => setDistricts(data.data))} setError={setError} />
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mt-3">
                {districts.map((d) => (
                  <div key={d.id} className="p-3 text-sm">{d.name}</div>
                ))}
                {districts.length === 0 && <p className="text-sm text-gray-500 p-3">No districts yet.</p>}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">Select a region to manage its districts.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AddRegionForm({ countries, onAdded, setError }) {
  const [name, setName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await geographyApi.createRegion({ name, countryId });
      setName('');
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add region.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <select value={countryId} onChange={(e) => setCountryId(e.target.value)} required className="border border-gray-300 rounded-md px-2 py-1.5 text-sm">
        <option value="">Country...</option>
        {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New region name"
        required
        className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm"
      />
      <Button type="submit" loading={loading}>Add</Button>
    </form>
  );
}

function AddDistrictForm({ regionId, onAdded, setError }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await geographyApi.createDistrict({ name, regionId });
      setName('');
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add district.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New district name"
        required
        className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm"
      />
      <Button type="submit" loading={loading}>Add</Button>
    </form>
  );
}
