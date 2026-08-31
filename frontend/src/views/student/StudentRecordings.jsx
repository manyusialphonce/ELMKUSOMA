import { useEffect, useState } from 'react';
import { recordingsApi } from '../../api/content';
import Alert from '../../components/common/Alert';

export default function StudentRecordings() {
  const [recordings, setRecordings] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    recordingsApi.list().then(({ data }) => setRecordings(data.data)).catch(() => {});
  }, []);

  const handlePlay = async (id) => {
    setError('');
    try {
      const { data } = await recordingsApi.get(id);
      setPlaying(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An active subscription is required to watch this lesson.');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Recorded Lessons</h1>
      <Alert type="error">{error}</Alert>

      {playing && (
        <div className="mb-6 border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-2">{playing.title}</h2>
          <video src={playing.streamUrl} controls className="w-full rounded-md bg-black" />
          <p className="text-xs text-gray-400 mt-2">
            Stream link expires shortly — this is a signed, time-limited URL (content protection).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recordings.map((r) => (
          <button
            key={r.id}
            onClick={() => handlePlay(r.id)}
            className="text-left border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-400 text-sm">
              {r.thumbnail ? (
                <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover" />
              ) : (
                'No thumbnail'
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-gray-900 text-sm">{r.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{r.subject?.name} · {r.uploadedBy?.fullName}</p>
            </div>
          </button>
        ))}
        {recordings.length === 0 && (
          <p className="text-gray-500 text-sm col-span-3">No recordings published yet.</p>
        )}
      </div>
    </div>
  );
}
