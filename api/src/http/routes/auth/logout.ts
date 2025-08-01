import { FastifyInstance } from 'fastify';
import { logoutController } from '../../controllers/logout';
import {
  logoutSuccessResponseSchema,
  logoutErrorResponseSchema,
  unauthorizedResponseSchema,
  internalServerErrorResponseSchema,
} from '@/schemas/responses';

export async function logoutRoute(app: FastifyInstance) {
  app.post('/logout', {
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
  }, logoutController);
} 