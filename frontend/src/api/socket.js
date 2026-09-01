import { io } from 'socket.io-client';

let socket = null;

/**
 * Returns a shared Socket.IO connection, authenticated with the same JWT
 * used for REST calls. Connects lazily on first use; call disconnectSocket()
 * on logout.
 */
export function getSocket() {
  if (socket) return socket;

  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/api\/v1$/, '');

  socket = io(baseUrl, {
    auth: { token: localStorage.getItem('elmkusoma_token') },
    autoConnect: false,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
