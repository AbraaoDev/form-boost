import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { listFormSubmissionsController } from '@/http/controllers/list-form-submissions';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { 
  listFormSubmissionsParamsSchema, 
  listFormSubmissionsQuerySchema 
} from '@/schemas/list-form-submissions';
import {
  listFormSubmissionsResponseSchema,
  formNotFoundErrorResponseSchema,
  invalidParamErrorResponseSchema,
  invalidPageErrorResponseSchema,
  unauthorizedResponseSchema,
  validationErrorResponseSchema,
  internalServerErrorResponseSchema,
} from '@/schemas/responses';

export async function listFormSubmissionsRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(requireJson({ accept: true }))
    .get(
      '/forms/:id/submit',
      {
        schema: {
          tags: ['forms'],
          security: [{ bearerAuth: [] }],
          summary: 'List form submissions with filters and pagination',
          params: listFormSubmissionsParamsSchema,
          querystring: listFormSubmissionsQuerySchema,
          response: {
            200: listFormSubmissionsResponseSchema,
            400: invalidParamErrorResponseSchema,
            401: unauthorizedResponseSchema,
            404: formNotFoundErrorResponseSchema,
            422: invalidPageErrorResponseSchema,
            500: internalServerErrorResponseSchema,
          },
        },
      },
      listFormSubmissionsController,
    );
} 