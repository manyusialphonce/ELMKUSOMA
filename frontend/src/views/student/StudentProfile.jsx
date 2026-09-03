import { useEffect, useState } from 'react';
import client from '../../api/client';
import useAuthStore from '../../stores/authStore';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function StudentProfile() {
  const { user } = useAuthStore();

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await client.get('/users/me');

      const profileData = data.data || data.user || data;

      setProfile({
        fullName:
          profileData.fullName ||
          profileData.name ||
          user?.fullName ||
          '',
        email:
          profileData.email ||
          user?.email ||
          '',
        phone:
          profileData.phone ||
          profileData.phoneNumber ||
          '',
        gender:
          profileData.gender || '',
        dateOfBirth: formatDateForInput(
          profileData.dateOfBirth
        ),
        address:
          profileData.address || '',
      });
    } catch (err) {
      /*
       * If /users/me is not yet available,
       * still display information stored after login.
       */
      setProfile({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        dateOfBirth: formatDateForInput(
          user?.dateOfBirth
        ),
        address: user?.address || '',
      });

      if (
        err.response &&
        err.response.status !== 404
      ) {
        setError(
          err.response?.data?.message ||
            'Unable to load your complete profile information.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim() || null,
        gender: profile.gender || null,
        dateOfBirth:
          profile.dateOfBirth || null,
        address:
          profile.address.trim() || null,
      };

      const { data } = await client.patch(
        '/users/me',
        payload
      );

      const updatedProfile =
        data.data || data.user || data;

      setProfile((prev) => ({
        ...prev,
        fullName:
          updatedProfile.fullName ||
          prev.fullName,
        phone:
          updatedProfile.phone ||
          updatedProfile.phoneNumber ||
          prev.phone,
        gender:
          updatedProfile.gender ||
          prev.gender,
        dateOfBirth:
          formatDateForInput(
            updatedProfile.dateOfBirth
          ) || prev.dateOfBirth,
        address:
          updatedProfile.address ||
          prev.address,
      }));

      setSuccess(
        'Your profile has been updated successfully.'
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to update your profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const initials = getInitials(
    profile.fullName || user?.fullName
  );

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-gray-200" />

          <div className="rounded-lg border border-gray-200 p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-3 w-56 rounded bg-gray-100" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div key={item}>
                    <div className="mb-2 h-3 w-20 rounded bg-gray-100" />
                    <div className="h-10 rounded bg-gray-100" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and keep your profile up to date.
        </p>
      </div>

      <Alert type="error">{error}</Alert>

      {success && (
        <Alert type="success">
          {success}
        </Alert>
      )}

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-800">
            {initials}
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              {profile.fullName || 'Student'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {profile.email || 'No email available'}
            </p>

            <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              Student
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-gray-200 bg-white p-5"
      >
        <h2 className="mb-5 text-base font-semibold text-gray-900">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={profile.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />

            <p className="mt-1 text-xs text-gray-400">
              Email changes require account verification.
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="+255..."
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select gender
              </option>

              <option value="MALE">
                Male
              </option>

              <option value="FEMALE">
                Female
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={profile.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="3"
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your address"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
          <Button
            type="submit"
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

function getInitials(name) {
  if (!name) return 'ST';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join('');
}

function formatDateForInput(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
}