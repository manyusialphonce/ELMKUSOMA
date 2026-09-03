const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { notifyUser } = require('./notifications.controller');
const { logAction } = require('../utils/auditLog');

// GET /api/v1/admin/verifications?status=PENDING
const listVerifications = asyncHandler(async (req, res) => {
  const { status = 'PENDING' } = req.query;

  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER', verificationStatus: status },
    select: {
      id: true, fullName: true, email: true, phoneNumber: true,
      identityDocumentType: true, identityDocumentNumber: true,
      profileImage: true, verificationStatus: true, createdAt: true,
      faculty: { include: { university: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  res.json({ data: teachers });
});

// PATCH /api/v1/admin/verifications/:userId/approve
const approveVerification = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.userId) },
    data: { verificationStatus: 'VERIFIED' },
  });

  await notifyUser(user.id, 'ACCOUNT_SECURITY', 'Your identity has been verified', {
    message: 'You can now publish live classes, recordings, and resources.',
  });

  await logAction(req.user.id, 'verification.approve', { entity: 'User', entityId: user.id });

  res.json({ data: user });
});

// PATCH /api/v1/admin/verifications/:userId/reject
const rejectVerification = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.userId) },
    data: { verificationStatus: 'REJECTED' },
  });

  await notifyUser(user.id, 'ACCOUNT_SECURITY', 'Identity verification rejected', {
    reason: req.body.reason || null,
  });

  await logAction(req.user.id, 'verification.reject', {
    entity: 'User', entityId: user.id, metadata: { reason: req.body.reason || null },
  });

  res.json({ data: user });
});

// GET /api/v1/admin/users?role=&accountStatus=&search=
const listUsers = asyncHandler(async (req, res) => {
  const { role, accountStatus, search } = req.query;

  const users = await prisma.user.findMany({
    where: {
      role: role || undefined,
      accountStatus: accountStatus || undefined,
      fullName: search ? { contains: search, mode: 'insensitive' } : undefined,
    },
    select: {
      id: true, fullName: true, email: true, phoneNumber: true,
      role: true, accountStatus: true, verificationStatus: true, createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  res.json({ data: users });
});

// PATCH /api/v1/admin/users/:id/suspend
const suspendUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { accountStatus: 'SUSPENDED' },
  });

  await logAction(req.user.id, 'user.suspend', { entity: 'User', entityId: user.id });

  res.json({ data: user });
});

// PATCH /api/v1/admin/users/:id/reactivate
const reactivateUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { accountStatus: 'ACTIVE' },
  });

  await logAction(req.user.id, 'user.reactivate', { entity: 'User', entityId: user.id });

  res.json({ data: user });
});

// GET /api/v1/admin/audit-logs?entity=&actorId=
const listAuditLogs = asyncHandler(async (req, res) => {
  const { entity, actorId } = req.query;

  const logs = await prisma.auditLog.findMany({
    where: {
      entity: entity || undefined,
      actorId: actorId ? Number(actorId) : undefined,
    },
    include: { actor: { select: { id: true, fullName: true, role: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  res.json({ data: logs });
});

// GET /api/v1/admin/live-classes?status=
const listAllLiveClasses = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const liveClasses = await prisma.liveClass.findMany({
    where: { status: status || undefined },
    include: {
      teacher: { select: { id: true, fullName: true } },
      subject: true,
      educationLevel: true,
      _count: { select: { attendances: true } },
    },
    orderBy: { startTime: 'desc' },
    take: 200,
  });

  res.json({ data: liveClasses });
});

// GET /api/v1/admin/recordings?status=  (includes drafts, unlike the public listing)
const listAllRecordings = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const recordings = await prisma.recording.findMany({
    where: { status: status || undefined },
    include: {
      uploadedBy: { select: { id: true, fullName: true } },
      subject: true,
      educationLevel: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  res.json({ data: recordings.map(({ storageKey, ...r }) => r) });
});

// GET /api/v1/admin/resources?status=  (includes drafts)
const listAllResources = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const resources = await prisma.resource.findMany({
    where: { status: status || undefined },
    include: {
      uploadedBy: { select: { id: true, fullName: true } },
      subject: true,
      educationLevel: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  res.json({ data: resources.map(({ storageKey, ...r }) => r) });
});

// GET /api/v1/admin/subscriptions?status=
const listAllSubscriptions = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const subscriptions = await prisma.subscription.findMany({
    where: { status: status || undefined },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
      plan: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  res.json({ data: subscriptions });
});

// GET /api/v1/admin/payments?status=
const listAllPayments = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const payments = await prisma.payment.findMany({
    where: { status: status || undefined },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  res.json({ data: payments });
});

module.exports = {
  listVerifications, approveVerification, rejectVerification,
  listUsers, suspendUser, reactivateUser, listAuditLogs,
  listAllLiveClasses, listAllRecordings, listAllResources,
  listAllSubscriptions, listAllPayments,
};
