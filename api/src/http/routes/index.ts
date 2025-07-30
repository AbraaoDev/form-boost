import type { FastifyInstance } from 'fastify';

import { authenticate } from './auth/authenticate';
import { register } from './auth/register';
import { createFormRoute } from './forms/create';

export async function apiRoutes(app: FastifyInstance) {
  app.register(register);
  app.register(authenticate);
  app.register(createFormRoute);
}
