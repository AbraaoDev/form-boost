import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticateController } from '@/http/controllers/authenticate';
import { authenticateBodySchema } from '@/schemas/authenticate';
import {
  authenticateSuccessResponseSchema,
  errorResponseSchema,
  internalServerErrorResponseSchema,
  unauthorizedResponseSchema,
  validationErrorResponseSchema,
} from '@/schemas/responses';

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate a user',
        body: authenticateBodySchema,
        response: {
          200: authenticateSuccessResponseSchema,
          400: errorResponseSchema,
          401: unauthorizedResponseSchema,
          422: validationErrorResponseSchema,
          500: internalServerErrorResponseSchema,
        },
      },
    },
    authenticateController,
  );
}
