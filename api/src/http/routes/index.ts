import type { FastifyInstance } from 'fastify';

import { authenticate } from './auth/authenticate';
import { register } from './auth/register';
import { createFormRoute } from './forms/create';
import { listFormsRoute } from './forms/list';

export async function apiRoutes(app: FastifyInstance) {
  app.register(register);
  app.register(authenticate);
  app.register(createFormRoute);
  app.register(listFormsRoute);
}
