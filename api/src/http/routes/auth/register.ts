import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { registerController } from '@/http/controllers/register';
import { registerBodySchema } from '@/schemas/register';
import {
  internalServerErrorResponseSchema,
  userAlreadyExistsErrorResponseSchema,
  validationErrorResponseSchema,
} from '@/schemas/responses';

export async function register(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: registerBodySchema,
        response: {
          201: z.object({}),
          400: validationErrorResponseSchema,
          409: userAlreadyExistsErrorResponseSchema,
          500: internalServerErrorResponseSchema,
        },
      },
    },
    registerController,
  );
}
