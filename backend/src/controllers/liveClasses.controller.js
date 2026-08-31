const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { emitToLiveClass } = require('../realtime/socket');
const { generateStreamingCredentials } = require('../services/streaming');

// GET /api/v1/live-classes?teacherId=&subjectId=&status=
const listLiveClasses = asyncHandler(async (req, res) => {
  const { teacherId, subjectId, status } = req.query;

  const liveClasses = await prisma.liveClass.findMany({
    where: {
      teacherId: teacherId ? Number(teacherId) : undefined,
      subjectId: subjectId ? Number(subjectId) : undefined,
      status: status || undefined,
    },
    include: {
      teacher: { select: { id: true, fullName: true } },
      subject: true,
      educationLevel: true,
    },
    orderBy: { startTime: 'desc' },
  });

  res.json({ data: liveClasses });
});

// GET /api/v1/live-classes/:id
const getLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await prisma.liveClass.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      teacher: { select: { id: true, fullName: true } },
      subject: true,
      educationLevel: true,
      schoolClass: true,
    },
  });
  if (!liveClass) throw ApiError.notFound('Live class not found.');
  res.json({ data: liveClass });
});

// POST /api/v1/live-classes  (Teacher only, verified only — SRS 10.6)
const createLiveClass = asyncHandler(async (req, res) => {
  const {
    subjectId, educationLevelId, classId, topic, description,
    startTime, durationMinutes, questionsEnabled,
  } = req.body;

  const liveClass = await prisma.liveClass.create({
    data: {
      teacherId: req.user.id,
      subjectId: Number(subjectId),
      educationLevelId: Number(educationLevelId),
      classId: classId ? Number(classId) : null,
      topic,
      description: description || null,
      startTime: new Date(startTime),
      durationMinutes: Number(durationMinutes),
      questionsEnabled: Boolean(questionsEnabled),
    },
  });

  res.status(201).json({ data: liveClass });
});

// POST /api/v1/live-classes/:id/start
// Creates the Agora channel identity (channel name = the room id) and
// returns the teacher's own publisher token in the same response, so the
// teacher's client can join immediately without a second round trip.
const startLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await prisma.liveClass.findUnique({ where: { id: Number(req.params.id) } });
  if (!liveClass) throw ApiError.notFound('Live class not found.');
  if (liveClass.teacherId !== req.user.id) throw ApiError.forbidden();

  const streamingRoomId = `room-${liveClass.id}`;

  const updated = await prisma.liveClass.update({
    where: { id: liveClass.id },
    data: {
      status: 'LIVE',
      startedAt: new Date(),
      streamingRoomId,
    },
  });

  emitToLiveClass(liveClass.id, 'live-class:started', {
    liveClassId: liveClass.id,
    streamingRoomId: updated.streamingRoomId,
  });

  let streaming = null;
  try {
    streaming = generateStreamingCredentials({
      liveClassId: liveClass.id, userId: req.user.id, isPublisher: true,
    });
  } catch (err) {
    // Streaming credentials are optional at this layer — if AGORA_APP_ID/
    // CERTIFICATE aren't configured yet, the class still starts and the
    // teacher can be given a token later once credentials are set up.
    console.warn('[streaming] could not generate publisher token:', err.message);
  }

  res.json({ data: updated, streaming });
});

// POST /api/v1/live-classes/:id/end
const endLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await prisma.liveClass.findUnique({ where: { id: Number(req.params.id) } });
  if (!liveClass) throw ApiError.notFound('Live class not found.');
  if (liveClass.teacherId !== req.user.id) throw ApiError.forbidden();

  const updated = await prisma.liveClass.update({
    where: { id: liveClass.id },
    data: { status: 'ENDED', endedAt: new Date() },
  });

  emitToLiveClass(liveClass.id, 'live-class:ended', { liveClassId: liveClass.id });

  res.json({ data: updated });
});

// POST /api/v1/live-classes/:id/join  (Student — requires active subscription, enforced by middleware)
const joinLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await prisma.liveClass.findUnique({ where: { id: Number(req.params.id) } });
  if (!liveClass) throw ApiError.notFound('Live class not found.');
  if (liveClass.status !== 'LIVE') throw ApiError.badRequest('This class is not currently live.');

  await prisma.attendance.upsert({
    where: { liveClassId_studentId: { liveClassId: liveClass.id, studentId: req.user.id } },
    update: {},
    create: { liveClassId: liveClass.id, studentId: req.user.id },
  });

  const streaming = (() => {
    try {
      return generateStreamingCredentials({
        liveClassId: liveClass.id, userId: req.user.id, isPublisher: false,
      });
    } catch (err) {
      throw ApiError.internal('Live streaming is not fully configured yet. Please contact support.');
    }
  })();

  res.json({ data: { streamingRoomId: liveClass.streamingRoomId }, streaming });
});

// POST /api/v1/live-classes/:id/leave  (Student)
const leaveLiveClass = asyncHandler(async (req, res) => {
  const attendance = await prisma.attendance.findUnique({
    where: { liveClassId_studentId: { liveClassId: Number(req.params.id), studentId: req.user.id } },
  });
  if (!attendance) throw ApiError.notFound('Attendance record not found.');

  const leftAt = new Date();
  const durationSecs = Math.round((leftAt - attendance.joinedAt) / 1000);

  const updated = await prisma.attendance.update({
    where: { id: attendance.id },
    data: { leftAt, durationSecs },
  });

  res.json({ data: updated });
});

module.exports = {
  listLiveClasses, getLiveClass, createLiveClass,
  startLiveClass, endLiveClass, joinLiveClass, leaveLiveClass,
};
