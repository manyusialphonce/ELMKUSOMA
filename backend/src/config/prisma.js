const { PrismaClient } = require('@prisma/client');

// Reuse a single PrismaClient instance across the app (and across hot
// reloads in dev) instead of creating a new connection pool per import.
const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

module.exports = prisma;
