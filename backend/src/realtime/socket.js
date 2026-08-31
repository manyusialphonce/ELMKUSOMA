const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/prisma');

let io;

/**
 * Initializes Socket.IO on top of the existing HTTP server (shared port —
 * no separate WebSocket process needed, unlike Laravel Reverb which runs
 * standalone). Call this once from server.js after app.listen().
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Authenticate the socket handshake using the same JWT as the REST API.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Unauthenticated'));

      const payload = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, fullName: true, role: true },
      });
      if (!user) return next(new Error('Unauthenticated'));

      socket.user = user;
      next();
    } catch {
      next(new Error('Unauthenticated'));
    }
  });

  io.on('connection', (socket) => {
    // Join a live class "room" — students and the teacher in the same
    // room receive each other's events (questions, attendance, live quiz).
    socket.on('live-class:join', (liveClassId) => {
      socket.join(`live-class:${liveClassId}`);
    });

    socket.on('live-class:leave', (liveClassId) => {
      socket.leave(`live-class:${liveClassId}`);
    });

    // Personal room for direct notifications (e.g. "your question was answered")
    socket.join(`user:${socket.user.id}`);
  });

  return io;
}

function getIo() {
  if (!io) throw new Error('Socket.IO not initialized — call initSocket(server) first.');
  return io;
}

// --- Emit helpers used by controllers ---

function emitToLiveClass(liveClassId, event, payload) {
  getIo().to(`live-class:${liveClassId}`).emit(event, payload);
}

function emitToUser(userId, event, payload) {
  getIo().to(`user:${userId}`).emit(event, payload);
}

module.exports = { initSocket, getIo, emitToLiveClass, emitToUser };
