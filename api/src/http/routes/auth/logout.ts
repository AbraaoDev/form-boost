import type { FastifyInstance } from 'fastify';
import {
  internalServerErrorResponseSchema,
  logoutErrorResponseSchema,
  logoutSuccessResponseSchema,
  unauthorizedResponseSchema,
} from '@/schemas/responses';
import { logoutController } from '../../controllers/logout';

export async function logoutRoute(app: FastifyInstance) {
  app.post(
    '/logout',
    {
      schema: {
        tags: ['auth'],
        summary: 'Logout user and clear session',
        response: {
          200: logoutSuccessResponseSchema,
          400: logoutErrorResponseSchema,
          401: unauthorizedResponseSchema,
          500: internalServerErrorResponseSchema,
        },
      },
    },
    logoutController,
  );
}
