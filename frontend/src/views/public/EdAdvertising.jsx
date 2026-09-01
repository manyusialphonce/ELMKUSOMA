import { useEffect, useState } from 'react';
import { advertisementsApi } from '../../api/advertisements';

const CATEGORY_LABELS = {
  GOVERNMENT_ANNOUNCEMENT: 'Government',
  MINISTRY_ANNOUNCEMENT: 'Ministry',
  EXAM_RESULTS: 'Exam Results',
  EXAM_TIMETABLE: 'Exam Timetable',
  SCHOLARSHIP: 'Scholarship',
  ADMISSION: 'Admission',
  TRAINING_OPPORTUNITY: 'Training',
  EDUCATION_OPPORTUNITY: 'Opportunity',
  SCHOOL_ANNOUNCEMENT: 'School',
  UNIVERSITY_ANNOUNCEMENT: 'University',
};

export default function EdAdvertising() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    advertisementsApi.list().then(({ data }) => setAds(data.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">ED Advertising</h1>
      <p className="text-gray-500 text-sm mb-6">
        Government and institutional announcements — scholarships, admissions, exam results, and more.
      </p>

      <div className="space-y-3">
        {ads.map((ad) => (
          <div key={ad.id} className="border border-gray-200 rounded-lg p-4">
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              {CATEGORY_LABELS[ad.category] || ad.category}
            </span>
            <h2 className="font-semibold text-gray-900 mt-2">{ad.title}</h2>
            {ad.description && <p className="text-sm text-gray-600 mt-1">{ad.description}</p>}
            <p className="text-xs text-gray-400 mt-2">
              Valid until {new Date(ad.endDate).toLocaleDateString()}
            </p>
          </div>
        ))}
        {ads.length === 0 && <p className="text-gray-500 text-sm">No announcements right now.</p>}
      </div>
    </div>
  );
}
