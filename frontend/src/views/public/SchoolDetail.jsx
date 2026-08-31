import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schoolsApi } from '../../api/schools';
import Alert from '../../components/common/Alert';

export default function SchoolDetail() {
  const { slug } = useParams();
  const [school, setSchool] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    schoolsApi.getBySlug(slug)
      .then(({ data }) => setSchool(data.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Alert type="error">School not found.</Alert>
        <Link to="/schools" className="text-blue-700 font-medium">Back to Schools</Link>
      </div>
    );
  }

  if (!school) return <p className="text-center text-gray-400 py-16">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-2xl font-bold text-blue-900">{school.name}</h1>
        {school.isVerified && (
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            Verified
          </span>
        )}
      </div>
      <p className="text-gray-500 mb-6">
        {school.region?.name}{school.district && `, ${school.district.name}`}
        {school.locationDetails && ` — ${school.locationDetails}`}
      </p>

      {school.description && <p className="text-gray-700 mb-6">{school.description}</p>}

      <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
        {school.phoneNumber && (
          <div><span className="text-gray-400 block">Phone</span>{school.phoneNumber}</div>
        )}
        {school.email && (
          <div><span className="text-gray-400 block">Email</span>{school.email}</div>
        )}
        {school.website && (
          <div><span className="text-gray-400 block">Website</span>{school.website}</div>
        )}
      </div>

      {school.educationLevels?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Education Levels Offered</h2>
          <div className="flex flex-wrap gap-2">
            {school.educationLevels.map((el) => (
              <span key={el.educationLevel.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {el.educationLevel.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {school.teachers?.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Teachers</h2>
          <div className="flex flex-wrap gap-2">
            {school.teachers.map(({ teacher }) => (
              <span key={teacher.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {teacher.fullName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
