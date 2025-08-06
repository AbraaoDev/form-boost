import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { listFormsController } from '@/http/controllers/list-forms';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { listFormsQuerySchema } from '@/schemas/list-forms';
import {
  internalServerErrorResponseSchema,
  listFormsResponseSchema,
  unauthorizedResponseSchema,
  validationErrorResponseSchema,
} from '@/schemas/responses';

export async function listFormsRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(requireJson({ accept: true }))
    .get(
      '/forms',
      {
        schema: {
          tags: ['forms'],
          security: [{ bearerAuth: [] }],
          summary:
            'List forms with filters and pagination. Use include_inactives=true to show deleted forms.',
          querystring: listFormsQuerySchema,
          response: {
            200: listFormsResponseSchema,
            400: validationErrorResponseSchema,
            401: unauthorizedResponseSchema,
            422: validationErrorResponseSchema,
            500: internalServerErrorResponseSchema,
          },
        },
      },
      listFormsController,
    );
}
