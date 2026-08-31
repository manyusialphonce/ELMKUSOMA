const prisma = require('../config/prisma');

/**
 * Unified search across the public-facing content types (SRS §10.18).
 *
 * Implemented with PostgreSQL ILIKE for now since no Meilisearch instance is
 * available in this environment. The function signature/return shape is
 * deliberately provider-agnostic — swapping to Meilisearch later means
 * rewriting the body of this file only; no controller or route changes.
 */
async function search(query, { limit = 8 } = {}) {
  const q = query.trim();
  if (!q) return { lessons: [], recordings: [], resources: [], schools: [], teachers: [], subjects: [] };

  const contains = { contains: q, mode: 'insensitive' };

  const [lessons, recordings, resources, schools, teachers, subjects] = await Promise.all([
    prisma.lesson.findMany({
      where: { status: 'PUBLISHED', title: contains },
      select: { id: true, title: true, subjectId: true },
      take: limit,
    }),
    prisma.recording.findMany({
      where: { status: 'PUBLISHED', title: contains },
      select: { id: true, title: true, subjectId: true },
      take: limit,
    }),
    prisma.resource.findMany({
      where: { status: 'PUBLISHED', title: contains },
      select: { id: true, title: true, type: true },
      take: limit,
    }),
    prisma.school.findMany({
      where: { name: contains },
      select: { id: true, name: true, slug: true },
      take: limit,
    }),
    prisma.user.findMany({
      where: { role: 'TEACHER', accountStatus: 'ACTIVE', fullName: contains },
      select: { id: true, fullName: true },
      take: limit,
    }),
    prisma.subject.findMany({
      where: { name: contains },
      select: { id: true, name: true, slug: true },
      take: limit,
    }),
  ]);

  return { lessons, recordings, resources, schools, teachers, subjects };
}

module.exports = { search };
