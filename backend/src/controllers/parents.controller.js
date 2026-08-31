const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/v1/parents/children  (Parent — list linked children)
const listChildren = asyncHandler(async (req, res) => {
  const links = await prisma.parentStudent.findMany({
    where: { parentId: req.user.id },
    include: {
      student: {
        select: {
          id: true, fullName: true, profileImage: true,
          educationLevel: true, school: { select: { id: true, name: true } },
        },
      },
    },
  });

  res.json({ data: links });
});

// POST /api/v1/parents/children  (Parent links a child by the student's email/phone)
// In production this should require the student (or an admin) to confirm the
// link rather than trusting the parent's claim outright — kept simple here
// as a clear extension point.
const linkChild = asyncHandler(async (req, res) => {
  const { studentEmail, relationship } = req.body;

  const student = await prisma.user.findFirst({
    where: { email: studentEmail, role: 'STUDENT' },
  });
  if (!student) throw ApiError.notFound('No student found with that email.');

  const link = await prisma.parentStudent.upsert({
    where: { parentId_studentId: { parentId: req.user.id, studentId: student.id } },
    update: { relationship: relationship || undefined },
    create: { parentId: req.user.id, studentId: student.id, relationship: relationship || null },
  });

  res.status(201).json({ data: link });
});

// DELETE /api/v1/parents/children/:studentId
const unlinkChild = asyncHandler(async (req, res) => {
  await prisma.parentStudent.delete({
    where: { parentId_studentId: { parentId: req.user.id, studentId: Number(req.params.studentId) } },
  }).catch(() => {
    throw ApiError.notFound('Link not found.');
  });

  res.json({ message: 'Child unlinked.' });
});

// Ensures the requesting parent actually has a confirmed link to :studentId
// before returning that student's data — the core parent-access guard.
async function assertLinked(parentId, studentId) {
  const link = await prisma.parentStudent.findUnique({
    where: { parentId_studentId: { parentId, studentId } },
  });
  if (!link) throw ApiError.forbidden('You are not linked to this student.');
}

// GET /api/v1/parents/children/:studentId/progress
const getChildProgress = asyncHandler(async (req, res) => {
  const studentId = Number(req.params.studentId);
  await assertLinked(req.user.id, studentId);

  const [lessonProgress, quizAttempts, submissions, attendances] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { studentId },
      include: { lesson: { select: { title: true, subjectId: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.quizAttempt.findMany({
      where: { studentId },
      include: { quiz: { select: { title: true, passingScore: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.assignmentSubmission.findMany({
      where: { studentId },
      include: { assignment: { select: { title: true, maxScore: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.attendance.findMany({
      where: { studentId },
      include: { liveClass: { select: { topic: true, startTime: true } } },
      orderBy: { joinedAt: 'desc' },
      take: 20,
    }),
  ]);

  res.json({ data: { lessonProgress, quizAttempts, submissions, attendances } });
});

// GET /api/v1/parents/children/:studentId/certificates
const getChildCertificates = asyncHandler(async (req, res) => {
  const studentId = Number(req.params.studentId);
  await assertLinked(req.user.id, studentId);

  const certificates = await prisma.certificate.findMany({
    where: { studentId },
    orderBy: { issuedAt: 'desc' },
  });

  res.json({ data: certificates });
});

module.exports = { listChildren, linkChild, unlinkChild, getChildProgress, getChildCertificates };
