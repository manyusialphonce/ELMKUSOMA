import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function AdminTeacherVerifications() {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    adminApi.listVerifications('PENDING').then(({ data }) => setTeachers(data.data)).catch(() => {});
  };

  const handleApprove = async (id) => {
    setActingId(id);
    try {
      await adminApi.approveVerification(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not approve this teacher.');
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):') || undefined;
    setActingId(id);
    try {
      await adminApi.rejectVerification(id, reason);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reject this teacher.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Teacher Verifications</h1>
      <p className="text-gray-500 text-sm mb-6">
        Review identity documents before teachers can publish live classes, recordings, or resources.
      </p>

      <Alert type="error">{error}</Alert>

      <div className="space-y-3">
        {teachers.map((t) => (
          <div key={t.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900">{t.fullName}</h2>
                  <Badge status={t.verificationStatus} />
                </div>
                <p className="text-sm text-gray-500 mt-1">{t.email} · {t.phoneNumber || 'no phone'}</p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">{t.identityDocumentType || 'No document type'}</span>
                  {t.identityDocumentNumber && ` — ${t.identityDocumentNumber}`}
                </p>
                {t.faculty && (
                  <p className="text-sm text-gray-500">
                    {t.faculty.university?.name} — {t.faculty.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleReject(t.id)}
                  loading={actingId === t.id}
                >
                  Reject
                </Button>
                <Button onClick={() => handleApprove(t.id)} loading={actingId === t.id}>
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))}

        {teachers.length === 0 && (
          <p className="text-gray-500 text-sm">No pending verifications.</p>
        )}
      </div>
    </div>
  );
}
