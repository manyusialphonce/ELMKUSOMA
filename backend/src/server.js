require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initSocket } = require('./realtime/socket');

const PORT = process.env.PORT || 8000;

// Socket.IO needs to attach to the raw HTTP server (not just the Express
// app) so both REST and WebSocket traffic share the same port.
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`ELMKUSOMA API (+ WebSocket) listening on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => process.exit(0));
});
