const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/v1/schools?regionId=&districtId=&educationLevelId=
const listSchools = asyncHandler(async (req, res) => {
  const { regionId, districtId, educationLevelId, search } = req.query;

  const schools = await prisma.school.findMany({
    where: {
      regionId: regionId ? Number(regionId) : undefined,
      districtId: districtId ? Number(districtId) : undefined,
      educationLevels: educationLevelId
        ? { some: { educationLevelId: Number(educationLevelId) } }
        : undefined,
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
    },
    include: { region: true, district: true, educationLevels: { include: { educationLevel: true } } },
    orderBy: { name: 'asc' },
  });

  res.json({ data: schools });
});

// GET /api/v1/schools/:slug
// This is effectively "the school's own box" referenced in the founder's
// notes — a school-scoped view of its own profile, teachers, and subjects.
const getSchoolBySlug = asyncHandler(async (req, res) => {
  const school = await prisma.school.findUnique({
    where: { slug: req.params.slug },
    include: {
      region: true,
      district: true,
      educationLevels: { include: { educationLevel: true } },
      subjects: { include: { subject: true } },
      teachers: {
        select: { teacher: { select: { id: true, fullName: true, profileImage: true } } },
      },
    },
  });

  if (!school) throw ApiError.notFound('School not found.');

  res.json({ data: school });
});

// POST /api/v1/schools  (Administrator / School Administrator only)
const createSchool = asyncHandler(async (req, res) => {
  const {
    name, slug, description, regionId, districtId, locationDetails,
    phoneNumber, email, website, hasStudio,
  } = req.body;

  const school = await prisma.school.create({
    data: {
      name,
      slug,
      description: description || null,
      regionId: Number(regionId),
      districtId: Number(districtId),
      locationDetails: locationDetails || null,
      phoneNumber: phoneNumber || null,
      email: email || null,
      website: website || null,
      hasStudio: Boolean(hasStudio),
      administratorId: req.user.role === 'SCHOOL_ADMINISTRATOR' ? req.user.id : null,
    },
  });

  res.status(201).json({ data: school });
});

module.exports = { listSchools, getSchoolBySlug, createSchool };
