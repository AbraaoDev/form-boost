import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { listFormSubmissionsController } from '@/http/controllers/list-form-submissions';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { 
  listFormSubmissionsParamsSchema, 
  listFormSubmissionsQuerySchema 
} from '@/schemas/list-form-submissions';

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
        },
      },
      listFormSubmissionsController,
    );
} 