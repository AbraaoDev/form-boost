import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getFormByIdController } from '@/http/controllers/get-form-by-id';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { getFormByIdParamsSchema } from '@/schemas/get-form-by-id';

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
          summary: 'Get form by id with full schema',
          params: getFormByIdParamsSchema,
        },
      },
      getFormByIdController,
    );
}
