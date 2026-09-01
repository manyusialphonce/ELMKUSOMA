import useAuthStore from '../../stores/authStore';
import Badge from '../../components/common/Badge';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
        <Row label="Full name" value={user.fullName} />
        <Row label="Email" value={user.email} />
        <Row label="Phone" value={user.phoneNumber || '—'} />
        <Row label="Role" value={user.role?.replace('_', ' ')} />
        <Row label="Language" value={user.languagePreference === 'sw' ? 'Kiswahili' : 'English'} />
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Account status</span>
          <Badge status={user.accountStatus} />
        </div>
        {user.verificationStatus && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Verification</span>
            <Badge status={user.verificationStatus} />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">Profile editing is coming soon.</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
