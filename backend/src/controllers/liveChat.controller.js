const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { emitToLiveClass } = require('../realtime/socket');

// GET /api/v1/live-classes/:liveClassId/chat  (recent history, e.g. on join)
const listMessages = asyncHandler(async (req, res) => {
  const liveClassId = Number(req.params.liveClassId);

  const messages = await prisma.liveChatMessage.findMany({
    where: { liveClassId },
    include: { user: { select: { id: true, fullName: true, role: true } } },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  res.json({ data: messages });
});

// POST /api/v1/live-classes/:liveClassId/chat  (student or teacher posts a chat message)
const postMessage = asyncHandler(async (req, res) => {
  const liveClassId = Number(req.params.liveClassId);
  const { message } = req.body;

  if (!message || !message.trim()) {
    throw ApiError.badRequest('Message cannot be empty.');
  }

  const liveClass = await prisma.liveClass.findUnique({ where: { id: liveClassId } });
  if (!liveClass) throw ApiError.notFound('Live class not found.');
  if (liveClass.status !== 'LIVE') throw ApiError.badRequest('Chat is only available while the class is live.');

  const chatMessage = await prisma.liveChatMessage.create({
    data: { liveClassId, userId: req.user.id, message: message.trim() },
    include: { user: { select: { id: true, fullName: true, role: true } } },
  });

  emitToLiveClass(liveClassId, 'chat:message', chatMessage);

  res.status(201).json({ data: chatMessage });
});

module.exports = { listMessages, postMessage };
