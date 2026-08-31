const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/v1/academic/departments?facultyId=
const listDepartments = asyncHandler(async (req, res) => {
  const { facultyId } = req.query;
  const departments = await prisma.department.findMany({
    where: { facultyId: facultyId ? Number(facultyId) : undefined },
    include: { faculty: { include: { university: true } } },
    orderBy: { name: 'asc' },
  });
  res.json({ data: departments });
});

// POST /api/v1/academic/departments  (Admin)
const createDepartment = asyncHandler(async (req, res) => {
  const { facultyId, name } = req.body;
  const department = await prisma.department.create({
    data: { facultyId: Number(facultyId), name },
  });
  res.status(201).json({ data: department });
});

// GET /api/v1/academic/programmes?departmentId=
const listProgrammes = asyncHandler(async (req, res) => {
  const { departmentId } = req.query;
  const programmes = await prisma.academicProgramme.findMany({
    where: { departmentId: departmentId ? Number(departmentId) : undefined },
    include: { department: true },
    orderBy: { name: 'asc' },
  });
  res.json({ data: programmes });
});

// POST /api/v1/academic/programmes  (Admin)
const createProgramme = asyncHandler(async (req, res) => {
  const { departmentId, name, awardLevel, durationYears } = req.body;
  const programme = await prisma.academicProgramme.create({
    data: {
      departmentId: Number(departmentId),
      name,
      awardLevel,
      durationYears: durationYears ? Number(durationYears) : 3,
    },
  });
  res.status(201).json({ data: programme });
});

// GET /api/v1/academic/courses?programmeId=&semesterId=
const listCourses = asyncHandler(async (req, res) => {
  const { programmeId, semesterId } = req.query;
  const courses = await prisma.academicCourse.findMany({
    where: {
      programmeId: programmeId ? Number(programmeId) : undefined,
      semesterId: semesterId ? Number(semesterId) : undefined,
    },
    include: { programme: true, semester: true },
    orderBy: { code: 'asc' },
  });
  res.json({ data: courses });
});

// POST /api/v1/academic/courses  (Admin)
const createCourse = asyncHandler(async (req, res) => {
  const { programmeId, semesterId, code, name, creditHours } = req.body;
  const course = await prisma.academicCourse.create({
    data: {
      programmeId: Number(programmeId),
      semesterId: semesterId ? Number(semesterId) : null,
      code,
      name,
      creditHours: creditHours ? Number(creditHours) : 3,
    },
  });
  res.status(201).json({ data: course });
});

// GET /api/v1/academic/years
const listAcademicYears = asyncHandler(async (req, res) => {
  const years = await prisma.academicYear.findMany({
    include: { semesters: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { startDate: 'desc' },
  });
  res.json({ data: years });
});

// POST /api/v1/academic/years  (Admin)
const createAcademicYear = asyncHandler(async (req, res) => {
  const { name, startDate, endDate } = req.body;
  const year = await prisma.academicYear.create({
    data: { name, startDate: new Date(startDate), endDate: new Date(endDate) },
  });
  res.status(201).json({ data: year });
});

// PATCH /api/v1/academic/years/:id/activate  (Admin — deactivates all others)
const activateAcademicYear = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.$transaction([
    prisma.academicYear.updateMany({ data: { isActive: false }, where: { isActive: true } }),
    prisma.academicYear.update({ where: { id }, data: { isActive: true } }),
  ]);
  const year = await prisma.academicYear.findUnique({ where: { id } });
  res.json({ data: year });
});

// POST /api/v1/academic/semesters  (Admin)
const createSemester = asyncHandler(async (req, res) => {
  const { academicYearId, name, sortOrder } = req.body;
  const semester = await prisma.semester.create({
    data: {
      academicYearId: Number(academicYearId),
      name,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
    },
  });
  res.status(201).json({ data: semester });
});

module.exports = {
  listDepartments, createDepartment,
  listProgrammes, createProgramme,
  listCourses, createCourse,
  listAcademicYears, createAcademicYear, activateAcademicYear,
  createSemester,
};
