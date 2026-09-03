const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { logAction } = require('../utils/auditLog');

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/v1/education/levels
const listEducationLevels = asyncHandler(async (req, res) => {
  const levels = await prisma.educationLevel.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ data: levels });
});

// POST /api/v1/education/levels  (Admin)
const createEducationLevel = asyncHandler(async (req, res) => {
  const { name, sortOrder } = req.body;
  if (!name) throw ApiError.badRequest('name is required.');

  const level = await prisma.educationLevel.create({
    data: { name, slug: slugify(name), sortOrder: sortOrder ? Number(sortOrder) : 0 },
  });

  await logAction(req.user.id, 'educationLevel.create', { entity: 'EducationLevel', entityId: level.id });
  res.status(201).json({ data: level });
});

// GET /api/v1/education/levels/:id/classes
const listClassesForLevel = asyncHandler(async (req, res) => {
  const classes = await prisma.schoolClass.findMany({
    where: { educationLevelId: Number(req.params.id) },
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ data: classes });
});

// POST /api/v1/education/classes  (Admin)
const createClass = asyncHandler(async (req, res) => {
  const { educationLevelId, name, sortOrder } = req.body;
  if (!educationLevelId || !name) throw ApiError.badRequest('educationLevelId and name are required.');

  const schoolClass = await prisma.schoolClass.create({
    data: {
      educationLevelId: Number(educationLevelId),
      name,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
    },
  });

  await logAction(req.user.id, 'class.create', { entity: 'SchoolClass', entityId: schoolClass.id });
  res.status(201).json({ data: schoolClass });
});

// GET /api/v1/education/subjects?educationLevelId=1
const listSubjects = asyncHandler(async (req, res) => {
  const { educationLevelId } = req.query;

  const subjects = await prisma.subject.findMany({
    where: educationLevelId
      ? { educationLevels: { some: { educationLevelId: Number(educationLevelId) } } }
      : undefined,
    include: { educationLevels: { include: { educationLevel: true } } },
    orderBy: { name: 'asc' },
  });
  res.json({ data: subjects });
});

// POST /api/v1/education/subjects  (Admin — optionally link to education levels immediately)
const createSubject = asyncHandler(async (req, res) => {
  const { name, educationLevelIds } = req.body;
  if (!name) throw ApiError.badRequest('name is required.');

  const subject = await prisma.subject.create({
    data: {
      name,
      slug: slugify(name),
      educationLevels: Array.isArray(educationLevelIds) && educationLevelIds.length
        ? { create: educationLevelIds.map((id) => ({ educationLevelId: Number(id) })) }
        : undefined,
    },
    include: { educationLevels: { include: { educationLevel: true } } },
  });

  await logAction(req.user.id, 'subject.create', { entity: 'Subject', entityId: subject.id });
  res.status(201).json({ data: subject });
});

// GET /api/v1/education/universities
const listUniversities = asyncHandler(async (req, res) => {
  const universities = await prisma.university.findMany({
    include: { faculties: true },
    orderBy: { name: 'asc' },
  });
  res.json({ data: universities });
});

module.exports = {
  listEducationLevels, createEducationLevel,
  listClassesForLevel, createClass,
  listSubjects, createSubject,
  listUniversities,
};
