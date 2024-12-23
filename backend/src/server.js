const app = require('./app');
const http = require('http');
const setupWebSocket = require('./websocket');
const sequelize = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server
const wss = setupWebSocket(server);

// Sync database and start server
sequelize.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`HTTP Server is running on port ${PORT}`);
      console.log(`WebSocket Server is running on ws://localhost:${PORT}/ws`);
      console.log('Database synced successfully');
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
