const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/v1/notifications?unreadOnly=true
const listNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly } = req.query;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: req.user.id,
      readAt: unreadOnly === 'true' ? null : undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: req.user.id, readAt: null },
  });

  res.json({ data: notifications, unreadCount });
});

// PATCH /api/v1/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await prisma.notification.findUnique({ where: { id: Number(req.params.id) } });
  if (!notification || notification.userId !== req.user.id) throw ApiError.notFound('Notification not found.');

  const updated = await prisma.notification.update({
    where: { id: notification.id },
    data: { readAt: new Date() },
  });

  res.json({ data: updated });
});

// PATCH /api/v1/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user.id, readAt: null },
    data: { readAt: new Date() },
  });

  res.json({ message: 'All notifications marked as read.' });
});

/**
 * Internal helper (not a route) — call this from other controllers/jobs to
 * create a notification, e.g. after publishing a recording:
 *   const { notifyUser } = require('./notifications.controller');
 *   await notifyUser(studentId, 'NEW_RECORDING', 'New lesson posted', {...});
 *
 * Honors NotificationPreference (SRS v1.0 §10.2 flow: "Read
 * NotificationPreference -> Allowed? -> Create in-app notification").
 * In-app notifications are skipped entirely if the user has disabled them;
 * per-category opt-outs (categoryFlags) are also respected. Returns null
 * when the notification was suppressed, so callers can tell the difference.
 */
async function notifyUser(userId, type, title, data = {}) {
  const preference = await prisma.notificationPreference.findUnique({ where: { userId } });

  if (preference) {
    if (!preference.inAppEnabled) return null;
    if (preference.categoryFlags && preference.categoryFlags[type] === false) return null;
  }

  return prisma.notification.create({
    data: { userId, type, title, data },
  });
}

// GET /api/v1/notifications/preferences
const getPreferences = asyncHandler(async (req, res) => {
  const preference = await prisma.notificationPreference.findUnique({ where: { userId: req.user.id } });
  res.json({
    data: preference || {
      userId: req.user.id, emailEnabled: true, smsEnabled: false, inAppEnabled: true, categoryFlags: null,
    },
  });
});

// PUT /api/v1/notifications/preferences
const updatePreferences = asyncHandler(async (req, res) => {
  const { emailEnabled, smsEnabled, inAppEnabled, categoryFlags } = req.body;

  const preference = await prisma.notificationPreference.upsert({
    where: { userId: req.user.id },
    update: {
      emailEnabled: emailEnabled ?? undefined,
      smsEnabled: smsEnabled ?? undefined,
      inAppEnabled: inAppEnabled ?? undefined,
      categoryFlags: categoryFlags ?? undefined,
    },
    create: {
      userId: req.user.id,
      emailEnabled: emailEnabled ?? true,
      smsEnabled: smsEnabled ?? false,
      inAppEnabled: inAppEnabled ?? true,
      categoryFlags: categoryFlags ?? null,
    },
  });

  res.json({ data: preference });
});

module.exports = {
  listNotifications, markAsRead, markAllAsRead, notifyUser,
  getPreferences, updatePreferences,
};
