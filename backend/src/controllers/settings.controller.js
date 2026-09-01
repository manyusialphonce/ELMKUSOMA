const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { logAction } = require('../utils/auditLog');

// GET /api/v1/admin/settings
const listSettings = asyncHandler(async (req, res) => {
  const settings = await prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
  res.json({ data: settings });
});

// PUT /api/v1/admin/settings/:key  (Super Administrator only)
const upsertSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  const setting = await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  await logAction(req.user.id, 'setting.update', { entity: 'SystemSetting', metadata: { key } });

  res.json({ data: setting });
});

module.exports = { listSettings, upsertSetting };
