const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateSignedUrl } = require('../utils/signedUrl');

// GET /api/v1/nursery-games?babyGroup=Baby%201&type=VIDEO_READING
const listGames = asyncHandler(async (req, res) => {
  const { babyGroup, type } = req.query;

  const games = await prisma.nurseryGame.findMany({
    where: {
      status: 'PUBLISHED',
      babyGroup: babyGroup || undefined,
      type: type || undefined,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Never expose contentUrl in list views — same content-protection rule
  // as Recording/Resource.
  res.json({ data: games.map(({ contentUrl, ...g }) => g) });
});

// GET /api/v1/nursery-games/:id  (returns signed content URL + student's own progress)
const getGame = asyncHandler(async (req, res) => {
  const game = await prisma.nurseryGame.findUnique({ where: { id: Number(req.params.id) } });
  if (!game || game.status !== 'PUBLISHED') throw ApiError.notFound('Game not found.');

  const { contentUrl, ...rest } = game;
  const signedUrl = generateSignedUrl(contentUrl, { userId: req.user.id });

  let myProgress = null;
  if (req.user.role === 'STUDENT') {
    myProgress = await prisma.nurseryGameProgress.findUnique({
      where: { nurseryGameId_studentId: { nurseryGameId: game.id, studentId: req.user.id } },
    });
  }

  res.json({ data: { ...rest, contentSignedUrl: signedUrl, myProgress } });
});

// POST /api/v1/nursery-games  (Teacher, verified — creates a nursery game/video entry)
const createGame = asyncHandler(async (req, res) => {
  const { title, description, type, babyGroup, contentUrl, thumbnail } = req.body;

  const game = await prisma.nurseryGame.create({
    data: {
      title,
      description: description || null,
      type,
      babyGroup: babyGroup || null,
      contentUrl,
      thumbnail: thumbnail || null,
      status: 'DRAFT',
    },
  });

  res.status(201).json({ data: game });
});

// PATCH /api/v1/nursery-games/:id/publish
const publishGame = asyncHandler(async (req, res) => {
  const game = await prisma.nurseryGame.update({
    where: { id: Number(req.params.id) },
    data: { status: 'PUBLISHED' },
  });
  res.json({ data: game });
});

// PUT /api/v1/nursery-games/:id/progress  (Student — record score/completion after playing)
const saveProgress = asyncHandler(async (req, res) => {
  const nurseryGameId = Number(req.params.id);
  const { score, completed } = req.body;

  const game = await prisma.nurseryGame.findUnique({ where: { id: nurseryGameId } });
  if (!game || game.status !== 'PUBLISHED') throw ApiError.notFound('Game not found.');

  const existing = await prisma.nurseryGameProgress.findUnique({
    where: { nurseryGameId_studentId: { nurseryGameId, studentId: req.user.id } },
  });

  const progress = await prisma.nurseryGameProgress.upsert({
    where: { nurseryGameId_studentId: { nurseryGameId, studentId: req.user.id } },
    update: {
      score: score ?? existing?.score,
      attempts: (existing?.attempts || 0) + 1,
      completedAt: completed ? new Date() : existing?.completedAt || null,
    },
    create: {
      nurseryGameId,
      studentId: req.user.id,
      score: score ?? null,
      attempts: 1,
      completedAt: completed ? new Date() : null,
    },
  });

  res.json({ data: progress });
});

module.exports = { listGames, getGame, createGame, publishGame, saveProgress };
