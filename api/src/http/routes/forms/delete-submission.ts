import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { deleteFormSubmissionController } from '@/http/controllers/delete-form-submission';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { deleteFormSubmissionParamsSchema } from '@/schemas/delete-form-submission';

export async function deleteFormSubmissionRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(requireJson({ accept: true }))
    .delete(
      '/forms/:id/submit/:id_submit',
      {
        schema: {
          tags: ['forms'],
          security: [{ bearerAuth: [] }],
          summary: 'Soft delete a form submission',
          params: deleteFormSubmissionParamsSchema,
        },
      },
      deleteFormSubmissionController,
    );
} 