const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateSignedUrl } = require('../utils/signedUrl');

// GET /api/v1/resources?educationLevelId=&subjectId=&type=&schoolId=&language=&search=
const listResources = asyncHandler(async (req, res) => {
  const { educationLevelId, subjectId, type, schoolId, language, search } = req.query;

  const resources = await prisma.resource.findMany({
    where: {
      status: 'PUBLISHED',
      educationLevelId: educationLevelId ? Number(educationLevelId) : undefined,
      subjectId: subjectId ? Number(subjectId) : undefined,
      schoolId: schoolId ? Number(schoolId) : undefined,
      type: type || undefined,
      language: language || undefined,
      title: search ? { contains: search, mode: 'insensitive' } : undefined,
    },
    include: {
      subject: true,
      educationLevel: true,
      school: { select: { id: true, name: true } },
      uploadedBy: { select: { id: true, fullName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Never expose storageKey in list views.
  res.json({ data: resources.map(({ storageKey, ...r }) => r) });
});

// GET /api/v1/resources/:id  (returns a signed download URL)
const getResource = asyncHandler(async (req, res) => {
  const resource = await prisma.resource.findUnique({
    where: { id: Number(req.params.id) },
    include: { subject: true, educationLevel: true, school: true },
  });
  if (!resource || resource.status !== 'PUBLISHED') throw ApiError.notFound('Resource not found.');

  const { storageKey, ...rest } = resource;
  const signedUrl = generateSignedUrl(storageKey, { userId: req.user.id, expiresInSeconds: 120 });

  console.log(`[access-log] user=${req.user.id} resource=resource:${resource.id} action=download`);

  res.json({ data: { ...rest, downloadUrl: signedUrl } });
});

// POST /api/v1/resources  (Teacher verified, or Admin — BR-007)
const createResource = asyncHandler(async (req, res) => {
  const {
    title, description, type, subjectId, educationLevelId, schoolId,
    language, storageKey,
  } = req.body;

  const resource = await prisma.resource.create({
    data: {
      uploadedById: req.user.id,
      title,
      description: description || null,
      type,
      subjectId: subjectId ? Number(subjectId) : null,
      educationLevelId: educationLevelId ? Number(educationLevelId) : null,
      schoolId: schoolId ? Number(schoolId) : null,
      language: language || 'en',
      storageKey,
      status: 'DRAFT',
    },
  });

  res.status(201).json({ data: resource });
});

// PATCH /api/v1/resources/:id/publish
const publishResource = asyncHandler(async (req, res) => {
  const resource = await prisma.resource.findUnique({ where: { id: Number(req.params.id) } });
  if (!resource) throw ApiError.notFound('Resource not found.');
  if (resource.uploadedById !== req.user.id && !['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'].includes(req.user.role)) {
    throw ApiError.forbidden();
  }

  const updated = await prisma.resource.update({
    where: { id: resource.id },
    data: { status: 'PUBLISHED' },
  });

  res.json({ data: updated });
});

// GET /api/v1/resources/mine  (Teacher — own uploads, including drafts)
const myResources = asyncHandler(async (req, res) => {
  const resources = await prisma.resource.findMany({
    where: { uploadedById: req.user.id },
    include: { subject: true, educationLevel: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: resources.map(({ storageKey, ...r }) => r) });
});

module.exports = { listResources, getResource, createResource, publishResource, myResources };
