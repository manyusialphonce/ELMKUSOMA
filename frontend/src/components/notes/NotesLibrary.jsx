import { useEffect, useState } from 'react';
import { resourcesApi } from '../../api/content';
import Alert from '../../components/common/Alert';

const TYPE_LABELS = {
  NOTES: 'Notes',
  BOOK: 'Book',
  PAST_PAPER: 'Past Paper',
  SYLLABUS: 'Syllabus',
  REFERENCE_MATERIAL: 'Reference Material',
  TEACHER_GUIDE: 'Teacher Guide',
  DOCUMENT: 'Document',
  REVISION_MATERIAL: 'Revision Material',
  OTHER: 'Other',
};

export default function NotesLibrary() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    resourcesApi.list().then(({ data }) => setResources(data.data)).catch(() => {});
  }, []);

  const handleDownload = async (id) => {
    setError('');
    setDownloadingId(id);
    try {
      const { data } = await resourcesApi.get(id);
      window.open(data.data.downloadUrl, '_blank', 'noopener');
    } catch (err) {
      setError(err.response?.data?.message || 'Please log in to download resources.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Notes Library</h1>
      <Alert type="error">{error}</Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((r) => (
          <div key={r.id} className="border border-gray-200 rounded-lg p-4">
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              {TYPE_LABELS[r.type] || r.type}
            </span>
            <h2 className="font-semibold text-gray-900 mt-2">{r.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {r.subject?.name} {r.educationLevel && `· ${r.educationLevel.name}`}
            </p>
            <button
              onClick={() => handleDownload(r.id)}
              disabled={downloadingId === r.id}
              className="mt-3 text-sm font-medium text-blue-700 hover:underline disabled:opacity-50"
            >
              {downloadingId === r.id ? 'Preparing download...' : 'Download'}
            </button>
          </div>
        ))}

        {resources.length === 0 && (
          <p className="text-gray-500 text-sm col-span-2">No resources published yet.</p>
        )}
      </div>
    </div>
  );
}
