const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateSignedUrl } = require('../utils/signedUrl');
const { notifyUser } = require('./notifications.controller');

// GET /api/v1/recordings?subjectId=&educationLevelId=&classId=
const listRecordings = asyncHandler(async (req, res) => {
  const { subjectId, educationLevelId, classId, search } = req.query;

  const recordings = await prisma.recording.findMany({
    where: {
      status: 'PUBLISHED',
      subjectId: subjectId ? Number(subjectId) : undefined,
      educationLevelId: educationLevelId ? Number(educationLevelId) : undefined,
      classId: classId ? Number(classId) : undefined,
      title: search ? { contains: search, mode: 'insensitive' } : undefined,
    },
    include: {
      subject: true,
      educationLevel: true,
      uploadedBy: { select: { id: true, fullName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Never expose storageKey in list views — thumbnail only, no video URL yet.
  res.json({ data: recordings.map(({ storageKey, ...r }) => r) });
});

// GET /api/v1/recordings/:id  (returns a short-lived signed URL — requires active subscription)
const getRecording = asyncHandler(async (req, res) => {
  const recording = await prisma.recording.findUnique({
    where: { id: Number(req.params.id) },
    include: { subject: true, educationLevel: true },
  });
  if (!recording || recording.status !== 'PUBLISHED') throw ApiError.notFound('Recording not found.');

  const { storageKey, ...rest } = recording;
  const signedUrl = generateSignedUrl(storageKey, { userId: req.user.id });

  // Access logging (SRS §11.6)
  console.log(`[access-log] user=${req.user.id} resource=recording:${recording.id} action=view`);

  res.json({ data: { ...rest, streamUrl: signedUrl } });
});

// POST /api/v1/recordings  (Teacher, verified only)
const createRecording = asyncHandler(async (req, res) => {
  const {
    title, description, subjectId, educationLevelId, classId,
    storageKey, thumbnail, durationSeconds, liveClassId,
  } = req.body;

  const recording = await prisma.recording.create({
    data: {
      liveClassId: liveClassId ? Number(liveClassId) : null,
      uploadedById: req.user.id,
      title,
      description: description || null,
      subjectId: Number(subjectId),
      educationLevelId: Number(educationLevelId),
      classId: classId ? Number(classId) : null,
      storageKey, // set by your upload flow (e.g. presigned PUT to S3) before this call
      thumbnail: thumbnail || null,
      durationSeconds: durationSeconds ? Number(durationSeconds) : null,
      status: 'DRAFT',
    },
  });

  res.status(201).json({ data: recording });
});

// PATCH /api/v1/recordings/:id/publish  (Teacher/Admin)
const publishRecording = asyncHandler(async (req, res) => {
  const recording = await prisma.recording.findUnique({ where: { id: Number(req.params.id) } });
  if (!recording) throw ApiError.notFound('Recording not found.');
  if (recording.uploadedById !== req.user.id && !['ADMINISTRATOR', 'SUPER_ADMINISTRATOR'].includes(req.user.role)) {
    throw ApiError.forbidden();
  }

  const updated = await prisma.recording.update({
    where: { id: recording.id },
    data: { status: 'PUBLISHED' },
  });

  // Notify enrolled students of the same education level (simple targeting
  // for now — refine to "students of this teacher's classes" once School
  // enrollment data is being actively maintained).
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT', educationLevelId: updated.educationLevelId },
    select: { id: true },
    take: 500,
  });
  await Promise.all(students.map((s) =>
    notifyUser(s.id, 'NEW_RECORDING', `New lesson: ${updated.title}`, { recordingId: updated.id })
  ));

  res.json({ data: updated });
});

module.exports = { listRecordings, getRecording, createRecording, publishRecording };
