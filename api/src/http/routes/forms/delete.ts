import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { deleteFormController } from '@/http/controllers/delete-form';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { getFormByIdParamsSchema } from '@/schemas/get-form-by-id';

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
        },
      },
      deleteFormController,
    );
}
