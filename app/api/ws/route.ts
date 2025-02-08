import { WebSocketServer } from 'ws';
import { NextRequest } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';

const wss = new WebSocketServer({ noServer: true });

const clients = new Map<string, WebSocket>();

wss.on('connection', (ws, userId: string) => {
  clients.set(userId, ws);

  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message);
      // Broadcast to all connected clients
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
  });
});

export function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    const payload = await verifyJwtToken(token);
    const userId = payload.id as string;

    // Upgrade the HTTP request to a WebSocket connection
    if (!req.socket.server.ws) {
      req.socket.server.ws = wss;
    }

    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, userId);
    });

    return new Response(null, { status: 101 });
  } catch (error) {
    console.error('WebSocket connection error:', error);
    return new Response('Unauthorized', { status: 401 });
  }
} 