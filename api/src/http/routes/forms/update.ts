import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateFormSchemaVersionController } from '@/http/controllers/update-form';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import {
  updateFormSchemaVersionBodySchema,
  updateParamsSchema,
} from '@/schemas/update-form';

export async function updateFormSchemaVersionRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(requireJson({ contentType: true }))
    .put(
      '/forms/:id/schema_version',
      {
        schema: {
          tags: ['forms'],
          security: [{ bearerAuth: [] }],
          summary: 'Update form schema version',
          body: updateFormSchemaVersionBodySchema,
          params: updateParamsSchema,
        },
      },
      updateFormSchemaVersionController,
    );
}
