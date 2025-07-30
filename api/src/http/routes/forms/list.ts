import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { listFormsController } from '@/http/controllers/list-forms';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { listFormsQuerySchema } from '@/schemas/list-forms-query';

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
          summary: 'List active forms with filters and pagination',
          querystring: listFormsQuerySchema,
        },
      },
      listFormsController,
    );
}
