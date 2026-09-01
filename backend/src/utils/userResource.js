// Equivalent of Laravel's UserResource — a single place that decides what
// shape of a User record ever leaves the API.
function userResource(user, { activeSubscription = null } = {}) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    languagePreference: user.languagePreference,
    role: user.role,
    accountStatus: user.accountStatus,
    verificationStatus: user.verificationStatus,
    region: user.region || undefined,
    district: user.district || undefined,
    educationLevel: user.educationLevel || undefined,
    school: user.school || undefined,
    hasActiveSubscription: Boolean(activeSubscription),
    createdAt: user.createdAt,
  };
}

module.exports = userResource;
