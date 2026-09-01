const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');
const userResource = require('../utils/userResource');

const USER_INCLUDE = {
  region: true,
  district: true,
  educationLevel: true,
  school: true,
};

// POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const {
    fullName, email, phoneNumber, password, role,
    gender, dateOfBirth, educationLevelId, regionId, districtId, schoolId,
    identityDocumentType, identityDocumentNumber, facultyId,
  } = req.body;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, ...(phoneNumber ? [{ phoneNumber }] : [])] },
  });
  if (existing) {
    throw ApiError.conflict('An account with this email or phone number already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phoneNumber: phoneNumber || null,
      password: hashedPassword,
      role, // restricted to self-registerable roles by the validator
      gender: gender || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      educationLevelId: educationLevelId || null,
      regionId: regionId || null,
      districtId: districtId || null,
      schoolId: schoolId || null,
      identityDocumentType: identityDocumentType || null,
      identityDocumentNumber: identityDocumentNumber || null,
      facultyId: facultyId || null,
      // Teachers/lecturers start UNVERIFIED and cannot publish content
      // (live classes, recordings, resources) until an admin verifies their
      // identity documents — enforced later via a requireVerified middleware.
      verificationStatus: role === 'TEACHER' ? 'PENDING' : 'UNVERIFIED',
    },
    include: USER_INCLUDE,
  });

  const token = signToken({ sub: user.id, role: user.role });

  res.status(201).json({
    user: userResource(user),
    token,
  });
});

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: USER_INCLUDE,
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw ApiError.unauthorized('The provided credentials are incorrect.');
  }

  if (user.accountStatus !== 'ACTIVE') {
    throw ApiError.forbidden('Your account is not active. Please contact support.');
  }

  const activeSubscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: 'ACTIVE', expiresAt: { gt: new Date() } },
  });

  const token = signToken({ sub: user.id, role: user.role });

  res.json({
    user: userResource(user, { activeSubscription }),
    token,
  });
});

// POST /api/v1/auth/logout
// Note: JWTs are stateless, so "logout" here is client-side (discard the
// token). If you need server-side revocation, add a token-blocklist table
// (e.g. in Redis) keyed by the token's jti claim.
const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// GET /api/v1/auth/me
const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: USER_INCLUDE,
  });

  const activeSubscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: 'ACTIVE', expiresAt: { gt: new Date() } },
  });

  res.json({ user: userResource(user, { activeSubscription }) });
});

module.exports = { register, login, logout, me };
