import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getFormByIdController } from '@/http/controllers/get-form-by-id';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { getFormByIdParamsSchema } from '@/schemas/get-form-by-id';
import {
  formResponseSchema,
  internalServerErrorResponseSchema,
  unauthorizedResponseSchema,
  validationErrorResponseSchema,
} from '@/schemas/responses';

export async function getFormByIdRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(requireJson({ accept: true }))
    .get(
      '/forms/:id',
      {
        schema: {
          tags: ['forms'],
          security: [{ bearerAuth: [] }],
          summary: 'Get form by id with full schema',
          params: getFormByIdParamsSchema,
          response: {
            200: formResponseSchema,
            400: validationErrorResponseSchema,
            401: unauthorizedResponseSchema,
            404: z.object({
              error: z.string().default('form_not_found'),
              message: z.string(),
            }),
            500: internalServerErrorResponseSchema,
          },
        },
      },
      getFormByIdController,
    );
}
