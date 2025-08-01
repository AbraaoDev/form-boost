import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { deleteFormController } from '@/http/controllers/delete-form';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { getFormByIdParamsSchema } from '@/schemas/get-form-by-id';
import {
  internalServerErrorResponseSchema,
  unauthorizedResponseSchema,
  validationErrorResponseSchema,
} from '@/schemas/responses';

export async function deleteFormRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(requireJson({ accept: true }))
    .delete(
      '/forms/:id',
      {
        schema: {
          tags: ['forms'],
          security: [{ bearerAuth: [] }],
          summary: 'Soft delete a form by id',
          params: getFormByIdParamsSchema,
          response: {
            200: z.object({
              message: z.string(),
            }),
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
      deleteFormController,
    );
}
