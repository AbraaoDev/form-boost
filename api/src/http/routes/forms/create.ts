import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createFormController } from '@/http/controllers/create-form';
import { auth } from '@/http/middlewares/auth';
import { createFormBodySchema } from '@/schemas/create-form';

export async function createFormRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/forms',
      {
        schema: {
          tags: ['forms'],
          summary: 'Create a new form',
          body: createFormBodySchema,
        },
      },
      createFormController,
    );
}
