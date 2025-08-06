import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createFormController } from '@/http/controllers/create-form';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { createFormBodySchema } from '@/schemas/create-form';
import {
  createFormSuccessResponseSchema,
  errorResponseSchema,
  internalServerErrorResponseSchema,
  unauthorizedResponseSchema,
  validationErrorResponseSchema,
} from '@/schemas/responses';

export async function createFormRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(requireJson({ accept: true, contentType: true }))
    .post(
      '/forms',
      {
        schema: {
          tags: ['forms'],
          security: [{ bearerAuth: [] }],
          summary: 'Create a new form',
          body: createFormBodySchema,
          response: {
            201: createFormSuccessResponseSchema,
            400: errorResponseSchema,
            401: unauthorizedResponseSchema,
            422: validationErrorResponseSchema,
            500: internalServerErrorResponseSchema,
          },
        },
      },
      createFormController,
    );
}
