import { FastifyInstance } from 'fastify';
import { logoutController } from '../../controllers/logout';

export async function logoutRoute(app: FastifyInstance) {
  app.post('/logout', {
    schema: {
      tags: ['auth'],
      summary: 'Logout',
    },
  }, logoutController);
} 