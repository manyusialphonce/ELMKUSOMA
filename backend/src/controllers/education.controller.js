const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/education/levels
const listEducationLevels = asyncHandler(async (req, res) => {
  const levels = await prisma.educationLevel.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ data: levels });
});

// GET /api/v1/education/levels/:id/classes
const listClassesForLevel = asyncHandler(async (req, res) => {
  const classes = await prisma.schoolClass.findMany({
    where: { educationLevelId: Number(req.params.id) },
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ data: classes });
});

// GET /api/v1/education/subjects?educationLevelId=1
const listSubjects = asyncHandler(async (req, res) => {
  const { educationLevelId } = req.query;

  const subjects = await prisma.subject.findMany({
    where: educationLevelId
      ? { educationLevels: { some: { educationLevelId: Number(educationLevelId) } } }
      : undefined,
    orderBy: { name: 'asc' },
  });
  res.json({ data: subjects });
});

// GET /api/v1/education/universities
const listUniversities = asyncHandler(async (req, res) => {
  const universities = await prisma.university.findMany({
    include: { faculties: true },
    orderBy: { name: 'asc' },
  });
  res.json({ data: universities });
});

module.exports = { listEducationLevels, listClassesForLevel, listSubjects, listUniversities };
