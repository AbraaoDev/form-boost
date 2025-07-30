import type { FastifyInstance } from 'fastify';

import { authenticate } from './auth/authenticate';
import { register } from './auth/register';

export async function apiRoutes(app: FastifyInstance) {
  app.register(authenticate);
  app.register(register);
}
