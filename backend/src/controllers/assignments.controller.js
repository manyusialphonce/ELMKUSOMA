const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/v1/assignments?subjectId=&classId=&teacherId=
const listAssignments = asyncHandler(async (req, res) => {
  const { subjectId, classId, teacherId } = req.query;

  const assignments = await prisma.assignment.findMany({
    where: {
      subjectId: subjectId ? Number(subjectId) : undefined,
      classId: classId ? Number(classId) : undefined,
      teacherId: teacherId ? Number(teacherId) : undefined,
    },
    include: {
      subject: true,
      teacher: { select: { id: true, fullName: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { deadline: 'asc' },
  });

  res.json({ data: assignments });
});

// GET /api/v1/assignments/:id  (includes the current student's own submission, if any)
const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: Number(req.params.id) },
    include: { subject: true, teacher: { select: { id: true, fullName: true } } },
  });
  if (!assignment) throw ApiError.notFound('Assignment not found.');

  let mySubmission = null;
  if (req.user.role === 'STUDENT') {
    mySubmission = await prisma.assignmentSubmission.findUnique({
      where: { assignmentId_studentId: { assignmentId: assignment.id, studentId: req.user.id } },
    });
  }

  res.json({ data: { ...assignment, mySubmission } });
});

// POST /api/v1/assignments  (Teacher, verified — BR-006)
const createAssignment = asyncHandler(async (req, res) => {
  const { subjectId, classId, title, description, instructions, attachment, deadline, maxScore } = req.body;

  const assignment = await prisma.assignment.create({
    data: {
      teacherId: req.user.id,
      subjectId: Number(subjectId),
      classId: classId ? Number(classId) : null,
      title,
      description: description || null,
      instructions: instructions || null,
      attachment: attachment || null,
      deadline: new Date(deadline),
      maxScore: maxScore ? Number(maxScore) : 100,
    },
  });

  res.status(201).json({ data: assignment });
});

// POST /api/v1/assignments/:id/submissions  (Student submits — within or after deadline)
const submitAssignment = asyncHandler(async (req, res) => {
  const assignmentId = Number(req.params.id);
  const { answerText, attachment } = req.body;

  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw ApiError.notFound('Assignment not found.');

  const isLate = new Date() > assignment.deadline;

  const submission = await prisma.assignmentSubmission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId: req.user.id } },
    update: {
      answerText: answerText || null,
      attachment: attachment || null,
      status: isLate ? 'LATE' : 'SUBMITTED',
      submittedAt: new Date(),
    },
    create: {
      assignmentId,
      studentId: req.user.id,
      answerText: answerText || null,
      attachment: attachment || null,
      status: isLate ? 'LATE' : 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  res.status(201).json({ data: submission });
});

// GET /api/v1/assignments/:id/submissions  (Teacher views all submissions)
const listSubmissions = asyncHandler(async (req, res) => {
  const assignment = await prisma.assignment.findUnique({ where: { id: Number(req.params.id) } });
  if (!assignment) throw ApiError.notFound('Assignment not found.');
  if (assignment.teacherId !== req.user.id) throw ApiError.forbidden();

  const submissions = await prisma.assignmentSubmission.findMany({
    where: { assignmentId: assignment.id },
    include: { student: { select: { id: true, fullName: true } } },
    orderBy: { submittedAt: 'asc' },
  });

  res.json({ data: submissions });
});

// PATCH /api/v1/submissions/:id/grade  (Teacher grades + comments + releases result)
const gradeSubmission = asyncHandler(async (req, res) => {
  const { score, teacherComment } = req.body;

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: Number(req.params.id) },
    include: { assignment: true },
  });
  if (!submission) throw ApiError.notFound('Submission not found.');
  if (submission.assignment.teacherId !== req.user.id) throw ApiError.forbidden();

  const updated = await prisma.assignmentSubmission.update({
    where: { id: submission.id },
    data: {
      score: Number(score),
      teacherComment: teacherComment || null,
      status: 'GRADED',
      gradedAt: new Date(),
    },
  });

  res.json({ data: updated });
});

module.exports = {
  listAssignments, getAssignment, createAssignment,
  submitAssignment, listSubmissions, gradeSubmission,
};
