const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  // Store client connections with their user IDs
  const clients = new Map();

  wss.on('connection', (ws, req) => {
    let userId = null;

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);

        if (data.type === 'auth') {
          const token = data.token;
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
            clients.set(userId, ws);
            ws.send(JSON.stringify({ type: 'auth', status: 'success' }));
          } catch (error) {
            ws.send(JSON.stringify({ type: 'auth', status: 'error', message: 'Invalid token' }));
            ws.close();
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
      }
    });
  });

  // Function to broadcast updates to relevant clients
  function broadcastToUser(userId, data) {
    const client = clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }

  // Function to broadcast project updates
  function broadcastProjectUpdate(userId, projectId, action, data) {
    broadcastToUser(userId, {
      type: 'project',
      action,
      projectId,
      data
    });
  }

  // Function to broadcast task updates
  function broadcastTaskUpdate(userId, taskId, action, data) {
    broadcastToUser(userId, {
      type: 'task',
      action,
      taskId,
      data
    });
  }

  return {
    broadcastProjectUpdate,
    broadcastTaskUpdate
  };
}

module.exports = setupWebSocket;
