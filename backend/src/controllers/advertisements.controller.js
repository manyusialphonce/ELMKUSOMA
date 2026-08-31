const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { logAction } = require('../utils/auditLog');
const { notifyUser } = require('./notifications.controller');

// GET /api/v1/advertisements?category=&educationLevelId=&regionId=
// Public — only APPROVED and currently within date range.
const listAdvertisements = asyncHandler(async (req, res) => {
  const { category, educationLevelId, regionId } = req.query;
  const now = new Date();

  const advertisements = await prisma.advertisement.findMany({
    where: {
      status: 'APPROVED',
      startDate: { lte: now },
      endDate: { gte: now },
      category: category || undefined,
      targetEducationLevelId: educationLevelId ? Number(educationLevelId) : undefined,
      targetRegionId: regionId ? Number(regionId) : undefined,
    },
    include: { advertiser: { select: { id: true, fullName: true } } },
    orderBy: { startDate: 'desc' },
  });

  res.json({ data: advertisements });
});

// POST /api/v1/advertisements  (Advertiser/Admin — submits for approval, BR-008)
const createAdvertisement = asyncHandler(async (req, res) => {
  const {
    title, description, imageUrl, category, startDate, endDate,
    targetEducationLevelId, targetRegionId,
  } = req.body;

  const advertisement = await prisma.advertisement.create({
    data: {
      advertiserId: req.user.id,
      title,
      description: description || null,
      imageUrl: imageUrl || null,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      targetEducationLevelId: targetEducationLevelId ? Number(targetEducationLevelId) : null,
      targetRegionId: targetRegionId ? Number(targetRegionId) : null,
      status: 'PENDING_APPROVAL',
    },
  });

  res.status(201).json({ data: advertisement });
});

// GET /api/v1/advertisements/mine  (Advertiser — own submissions, any status)
const myAdvertisements = asyncHandler(async (req, res) => {
  const advertisements = await prisma.advertisement.findMany({
    where: { advertiserId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: advertisements });
});

// GET /api/v1/advertisements/pending  (Admin — moderation queue)
const listPending = asyncHandler(async (req, res) => {
  const advertisements = await prisma.advertisement.findMany({
    where: { status: 'PENDING_APPROVAL' },
    include: { advertiser: { select: { id: true, fullName: true, email: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ data: advertisements });
});

// PATCH /api/v1/advertisements/:id/approve  (Admin)
const approveAdvertisement = asyncHandler(async (req, res) => {
  const ad = await prisma.advertisement.update({
    where: { id: Number(req.params.id) },
    data: { status: 'APPROVED' },
  });

  await notifyUser(ad.advertiserId, 'NEW_ANNOUNCEMENT', `Your advertisement "${ad.title}" was approved`, {
    advertisementId: ad.id,
  });
  await logAction(req.user.id, 'advertisement.approve', { entity: 'Advertisement', entityId: ad.id });

  res.json({ data: ad });
});

// PATCH /api/v1/advertisements/:id/reject  (Admin)
const rejectAdvertisement = asyncHandler(async (req, res) => {
  const ad = await prisma.advertisement.update({
    where: { id: Number(req.params.id) },
    data: { status: 'REJECTED', rejectionReason: req.body.reason || null },
  });

  await notifyUser(ad.advertiserId, 'NEW_ANNOUNCEMENT', `Your advertisement "${ad.title}" was rejected`, {
    advertisementId: ad.id, reason: req.body.reason || null,
  });
  await logAction(req.user.id, 'advertisement.reject', { entity: 'Advertisement', entityId: ad.id });

  res.json({ data: ad });
});

module.exports = {
  listAdvertisements, createAdvertisement, myAdvertisements,
  listPending, approveAdvertisement, rejectAdvertisement,
};
