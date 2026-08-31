const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateSignedUrl } = require('../utils/signedUrl');
const { notifyUser } = require('./notifications.controller');

// GET /api/v1/lessons?subjectId=&educationLevelId=&classId=
const listLessons = asyncHandler(async (req, res) => {
  const { subjectId, educationLevelId, classId } = req.query;

  const lessons = await prisma.lesson.findMany({
    where: {
      status: 'PUBLISHED',
      subjectId: subjectId ? Number(subjectId) : undefined,
      educationLevelId: educationLevelId ? Number(educationLevelId) : undefined,
      classId: classId ? Number(classId) : undefined,
    },
    include: { subject: true, educationLevel: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  // Attach the current student's own progress, if any (avoids N+1 from the frontend)
  let progressByLesson = {};
  if (req.user?.role === 'STUDENT') {
    const progress = await prisma.lessonProgress.findMany({
      where: { studentId: req.user.id, lessonId: { in: lessons.map((l) => l.id) } },
    });
    progressByLesson = Object.fromEntries(progress.map((p) => [p.lessonId, p]));
  }

  res.json({
    data: lessons.map(({ contentUrl, ...l }) => ({
      ...l,
      myProgress: progressByLesson[l.id] || null,
    })),
  });
});

// GET /api/v1/lessons/:id  (returns signed content URL for video lessons)
const getLesson = asyncHandler(async (req, res) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: Number(req.params.id) },
    include: { subject: true, educationLevel: true, teacher: { select: { id: true, fullName: true } } },
  });
  if (!lesson || lesson.status !== 'PUBLISHED') throw ApiError.notFound('Lesson not found.');

  const { contentUrl, ...rest } = lesson;
  const streamUrl = contentUrl ? generateSignedUrl(contentUrl, { userId: req.user.id }) : null;

  let myProgress = null;
  if (req.user.role === 'STUDENT') {
    myProgress = await prisma.lessonProgress.findUnique({
      where: { lessonId_studentId: { lessonId: lesson.id, studentId: req.user.id } },
    });
  }

  res.json({ data: { ...rest, streamUrl, myProgress } });
});

// POST /api/v1/lessons  (Teacher, verified)
const createLesson = asyncHandler(async (req, res) => {
  const {
    subjectId, educationLevelId, classId, title, description,
    type, contentUrl, bodyText, sortOrder,
  } = req.body;

  const lesson = await prisma.lesson.create({
    data: {
      teacherId: req.user.id,
      subjectId: Number(subjectId),
      educationLevelId: Number(educationLevelId),
      classId: classId ? Number(classId) : null,
      title,
      description: description || null,
      type: type || 'VIDEO',
      contentUrl: contentUrl || null,
      bodyText: bodyText || null,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
      status: 'DRAFT',
    },
  });

  res.status(201).json({ data: lesson });
});

// PATCH /api/v1/lessons/:id/publish
const publishLesson = asyncHandler(async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { id: Number(req.params.id) } });
  if (!lesson) throw ApiError.notFound('Lesson not found.');
  if (lesson.teacherId !== req.user.id && !['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'].includes(req.user.role)) {
    throw ApiError.forbidden();
  }

  const updated = await prisma.lesson.update({
    where: { id: lesson.id },
    data: { status: 'PUBLISHED' },
  });

  const students = await prisma.user.findMany({
    where: { role: 'STUDENT', educationLevelId: updated.educationLevelId },
    select: { id: true },
    take: 500,
  });
  await Promise.all(students.map((s) =>
    notifyUser(s.id, 'NEW_ANNOUNCEMENT', `New lesson: ${updated.title}`, { lessonId: updated.id })
  ));

  res.json({ data: updated });
});

// PUT /api/v1/lessons/:id/progress  (Student — SRS v1.0 activity: "Save lesson progress")
const saveProgress = asyncHandler(async (req, res) => {
  const lessonId = Number(req.params.id);
  const { progressPercent } = req.body;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson || lesson.status !== 'PUBLISHED') throw ApiError.notFound('Lesson not found.');

  const clamped = Math.max(0, Math.min(100, Number(progressPercent)));

  const progress = await prisma.lessonProgress.upsert({
    where: { lessonId_studentId: { lessonId, studentId: req.user.id } },
    update: {
      progressPercent: clamped,
      completedAt: clamped >= 100 ? new Date() : null,
    },
    create: {
      lessonId,
      studentId: req.user.id,
      progressPercent: clamped,
      completedAt: clamped >= 100 ? new Date() : null,
    },
  });

  res.json({ data: progress });
});

// GET /api/v1/lessons/progress/me  (Student's own progress across all lessons)
const myProgress = asyncHandler(async (req, res) => {
  const progress = await prisma.lessonProgress.findMany({
    where: { studentId: req.user.id },
    include: { lesson: { select: { id: true, title: true, subjectId: true } } },
    orderBy: { updatedAt: 'desc' },
  });
  res.json({ data: progress });
});

module.exports = { listLessons, getLesson, createLesson, publishLesson, saveProgress, myProgress };
