const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/v1/setup-drafts?type=school  (resume the admin's own in-progress draft)
const getActiveDraft = asyncHandler(async (req, res) => {
  const { type } = req.query;

  const draft = await prisma.institutionSetupDraft.findFirst({
    where: { adminId: req.user.id, type, status: 'IN_PROGRESS' },
    orderBy: { updatedAt: 'desc' },
  });

  res.json({ data: draft || null });
});

// POST /api/v1/setup-drafts  (start a new wizard, or return the existing in-progress one)
const startDraft = asyncHandler(async (req, res) => {
  const { type } = req.body;

  const existing = await prisma.institutionSetupDraft.findFirst({
    where: { adminId: req.user.id, type, status: 'IN_PROGRESS' },
  });
  if (existing) return res.json({ data: existing });

  const draft = await prisma.institutionSetupDraft.create({
    data: { adminId: req.user.id, type, currentStep: 1, data: {} },
  });

  res.status(201).json({ data: draft });
});

// PUT /api/v1/setup-drafts/:id  (save progress on the current step)
const updateDraft = asyncHandler(async (req, res) => {
  const draft = await prisma.institutionSetupDraft.findUnique({ where: { id: Number(req.params.id) } });
  if (!draft) throw ApiError.notFound('Draft not found.');
  if (draft.adminId !== req.user.id) throw ApiError.forbidden();

  const { currentStep, data } = req.body;

  const updated = await prisma.institutionSetupDraft.update({
    where: { id: draft.id },
    data: {
      currentStep: currentStep ?? draft.currentStep,
      // Merge rather than overwrite, so earlier steps' data isn't lost
      // when a later step only submits its own fields.
      data: { ...draft.data, ...data },
    },
  });

  res.json({ data: updated });
});

// POST /api/v1/setup-drafts/:id/complete  (finalize — creates the actual School record)
const completeDraft = asyncHandler(async (req, res) => {
  const draft = await prisma.institutionSetupDraft.findUnique({ where: { id: Number(req.params.id) } });
  if (!draft) throw ApiError.notFound('Draft not found.');
  if (draft.adminId !== req.user.id) throw ApiError.forbidden();
  if (draft.status !== 'IN_PROGRESS') throw ApiError.badRequest('This draft is already finalized.');

  const d = draft.data;
  if (!d.name || !d.slug || !d.regionId || !d.districtId) {
    throw ApiError.badRequest('Draft is missing required fields (name, slug, regionId, districtId).');
  }

  const result = await prisma.$transaction(async (tx) => {
    const school = await tx.school.create({
      data: {
        name: d.name,
        slug: d.slug,
        description: d.description || null,
        regionId: Number(d.regionId),
        districtId: Number(d.districtId),
        locationDetails: d.locationDetails || null,
        phoneNumber: d.phoneNumber || null,
        email: d.email || null,
        website: d.website || null,
        hasStudio: Boolean(d.hasStudio),
        administratorId: req.user.id,
      },
    });

    await tx.institutionSetupDraft.update({
      where: { id: draft.id },
      data: { status: 'COMPLETED' },
    });

    return school;
  });

  res.status(201).json({ data: result });
});

module.exports = { getActiveDraft, startDraft, updateDraft, completeDraft };
