const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/v1/quizzes?subjectId=&teacherId=
const listQuizzes = asyncHandler(async (req, res) => {
  const { subjectId, teacherId } = req.query;

  const quizzes = await prisma.quiz.findMany({
    where: {
      subjectId: subjectId ? Number(subjectId) : undefined,
      teacherId: teacherId ? Number(teacherId) : undefined,
    },
    include: {
      subject: true,
      teacher: { select: { id: true, fullName: true } },
      _count: { select: { questions: true, attempts: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // For students, attach their own attempt count per quiz so the list can
  // show "Attempted" / "Take Quiz" without a separate round trip.
  if (req.user?.role === 'STUDENT') {
    const myAttempts = await prisma.quizAttempt.groupBy({
      by: ['quizId'],
      where: { studentId: req.user.id, quizId: { in: quizzes.map((q) => q.id) } },
      _count: { id: true },
      _max: { score: true },
    });
    const byQuiz = Object.fromEntries(myAttempts.map((a) => [a.quizId, a]));
    return res.json({
      data: quizzes.map((q) => ({
        ...q,
        myAttemptsCount: byQuiz[q.id]?._count.id || 0,
        myBestScore: byQuiz[q.id]?._max.score ?? null,
      })),
    });
  }

  res.json({ data: quizzes });
});

// GET /api/v1/quizzes/:id  (question list WITHOUT correct answers for students)
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: Number(req.params.id) },
    include: { questions: { orderBy: { sortOrder: 'asc' } }, subject: true },
  });
  if (!quiz) throw ApiError.notFound('Quiz not found.');

  const isOwner = req.user?.id === quiz.teacherId;
  const questions = quiz.questions.map((q) => {
    if (isOwner) return q;
    // Strip correct answers / isCorrect flags before sending to students
    const { correctAnswer, ...rest } = q;
    const options = Array.isArray(q.options)
      ? q.options.map(({ isCorrect, ...opt }) => opt)
      : q.options;
    return { ...rest, options };
  });

  res.json({ data: { ...quiz, questions } });
});

// POST /api/v1/quizzes  (Teacher, verified — creates quiz + questions in one call)
const createQuiz = asyncHandler(async (req, res) => {
  const {
    subjectId, title, description, timeLimitMins, startTime, endTime,
    attemptLimit, passingScore, questions, liveClassId,
  } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    throw ApiError.badRequest('A quiz must include at least one question.');
  }

  const quiz = await prisma.quiz.create({
    data: {
      teacherId: req.user.id,
      liveClassId: liveClassId ? Number(liveClassId) : null,
      subjectId: Number(subjectId),
      title,
      description: description || null,
      timeLimitMins: timeLimitMins ? Number(timeLimitMins) : null,
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
      attemptLimit: attemptLimit ? Number(attemptLimit) : 1,
      passingScore: passingScore ? Number(passingScore) : null,
      questions: {
        create: questions.map((q, i) => ({
          type: q.type,
          questionText: q.questionText,
          options: q.options || null,
          correctAnswer: q.correctAnswer || null,
          points: q.points || 1,
          sortOrder: i,
        })),
      },
    },
    include: { questions: true },
  });

  res.status(201).json({ data: quiz });
});

// POST /api/v1/quizzes/:id/attempts  (Student submits answers — auto-graded)
const submitAttempt = asyncHandler(async (req, res) => {
  const quizId = Number(req.params.id);
  const { answers } = req.body; // [{ quizQuestionId, answerText }]

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });
  if (!quiz) throw ApiError.notFound('Quiz not found.');

  const attemptCount = await prisma.quizAttempt.count({
    where: { quizId, studentId: req.user.id },
  });
  if (attemptCount >= quiz.attemptLimit) {
    throw ApiError.forbidden('You have used all allowed attempts for this quiz.');
  }

  const questionById = Object.fromEntries(quiz.questions.map((q) => [q.id, q]));
  let totalScore = 0;

  const gradedAnswers = answers.map((a) => {
    const question = questionById[a.quizQuestionId];
    if (!question) return null;

    let isCorrect = null;
    let pointsAwarded = 0;

    if (question.type === 'MULTIPLE_CHOICE' && Array.isArray(question.options)) {
      const correctOption = question.options.find((o) => o.isCorrect);
      isCorrect = correctOption && correctOption.text === a.answerText;
    } else if (question.type === 'TRUE_FALSE' || question.type === 'SHORT_ANSWER') {
      isCorrect = question.correctAnswer &&
        question.correctAnswer.trim().toLowerCase() === (a.answerText || '').trim().toLowerCase();
    }

    if (isCorrect) pointsAwarded = question.points;
    totalScore += pointsAwarded;

    return {
      quizQuestionId: question.id,
      answerText: a.answerText,
      isCorrect,
      pointsAwarded,
    };
  }).filter(Boolean);

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId,
      studentId: req.user.id,
      score: totalScore,
      submittedAt: new Date(),
      answers: { create: gradedAnswers },
    },
    include: { answers: true },
  });

  res.status(201).json({ data: attempt });
});

// GET /api/v1/quizzes/:id/results  (Teacher — class statistics, SRS 10.12)
const getQuizResults = asyncHandler(async (req, res) => {
  const quiz = await prisma.quiz.findUnique({ where: { id: Number(req.params.id) } });
  if (!quiz) throw ApiError.notFound('Quiz not found.');
  if (quiz.teacherId !== req.user.id) throw ApiError.forbidden();

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId: quiz.id },
    include: { student: { select: { id: true, fullName: true } } },
    orderBy: { score: 'desc' },
  });

  const scores = attempts.map((a) => a.score).filter((s) => s !== null);
  const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  res.json({ data: { attempts, averageScore: average, totalAttempts: attempts.length } });
});

// GET /api/v1/quizzes/attempts/me  (Student — own attempt history across all quizzes)
const myAttempts = asyncHandler(async (req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { studentId: req.user.id },
    include: { quiz: { select: { id: true, title: true, passingScore: true, subject: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: attempts });
});

module.exports = { listQuizzes, getQuiz, createQuiz, submitAttempt, getQuizResults, myAttempts };
