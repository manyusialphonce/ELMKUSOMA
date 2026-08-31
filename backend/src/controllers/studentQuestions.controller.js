const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { emitToLiveClass, emitToUser } = require('../realtime/socket');

// GET /api/v1/live-classes/:liveClassId/questions  (Teacher — manage; Student — see own)
const listQuestions = asyncHandler(async (req, res) => {
  const liveClassId = Number(req.params.liveClassId);
  const where = { liveClassId };

  // Students only see their own questions; teachers see everyone's.
  if (req.user.role === 'STUDENT') {
    where.studentId = req.user.id;
  }

  const questions = await prisma.studentQuestion.findMany({
    where,
    include: { student: { select: { id: true, fullName: true } } },
    orderBy: { createdAt: 'asc' },
  });

  res.json({ data: questions });
});

// POST /api/v1/live-classes/:liveClassId/questions  (Student requests permission to ask)
const requestQuestion = asyncHandler(async (req, res) => {
  const liveClassId = Number(req.params.liveClassId);

  const liveClass = await prisma.liveClass.findUnique({ where: { id: liveClassId } });
  if (!liveClass) throw ApiError.notFound('Live class not found.');
  if (!liveClass.questionsEnabled) {
    throw ApiError.forbidden('The teacher has not enabled questions for this class.');
  }

  const question = await prisma.studentQuestion.create({
    data: {
      liveClassId,
      studentId: req.user.id,
      question: req.body.question || null, // may be filled in after approval too
      status: 'PENDING',
    },
    include: { student: { select: { id: true, fullName: true } } },
  });

  // Notify the teacher's view of the classroom in real time.
  emitToLiveClass(liveClassId, 'question:requested', question);

  res.status(201).json({ data: question });
});

// PATCH /api/v1/questions/:id/approve  (Teacher)
const approveQuestion = asyncHandler(async (req, res) => {
  const question = await approveOrReject(req, 'APPROVED');
  emitToLiveClass(question.liveClassId, 'question:updated', question);
  emitToUser(question.studentId, 'question:updated', question);
  res.json({ data: question });
});

// PATCH /api/v1/questions/:id/reject  (Teacher)
const rejectQuestion = asyncHandler(async (req, res) => {
  const question = await approveOrReject(req, 'REJECTED');
  emitToLiveClass(question.liveClassId, 'question:updated', question);
  emitToUser(question.studentId, 'question:updated', question);
  res.json({ data: question });
});

async function approveOrReject(req, status) {
  const question = await prisma.studentQuestion.findUnique({
    where: { id: Number(req.params.id) },
    include: { liveClass: true },
  });
  if (!question) throw ApiError.notFound('Question not found.');
  if (question.liveClass.teacherId !== req.user.id) throw ApiError.forbidden();

  return prisma.studentQuestion.update({
    where: { id: question.id },
    data: { status },
  });
}

// PATCH /api/v1/questions/:id/answer  (Teacher responds)
const answerQuestion = asyncHandler(async (req, res) => {
  const question = await prisma.studentQuestion.findUnique({
    where: { id: Number(req.params.id) },
    include: { liveClass: true },
  });
  if (!question) throw ApiError.notFound('Question not found.');
  if (question.liveClass.teacherId !== req.user.id) throw ApiError.forbidden();
  if (question.status !== 'APPROVED') {
    throw ApiError.badRequest('Only approved questions can be answered.');
  }

  const updated = await prisma.studentQuestion.update({
    where: { id: question.id },
    data: { answer: req.body.answer, status: 'ANSWERED' },
  });

  emitToLiveClass(updated.liveClassId, 'question:updated', updated);
  emitToUser(updated.studentId, 'question:updated', updated);

  res.json({ data: updated });
});

module.exports = { listQuestions, requestQuestion, approveQuestion, rejectQuestion, answerQuestion };
