import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { submitFormController } from '@/http/controllers/submit-form';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import {
  internalServerErrorResponseSchema,
  submitFormErrorResponseSchema,
  submitFormSuccessResponseSchema,
  unauthorizedResponseSchema,
  validationErrorResponseSchema,
} from '@/schemas/responses';
import { submitFormBodySchema } from '@/schemas/submit-form';

export async function submitFormRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(requireJson({ accept: true, contentType: true }))
    .post(
      '/forms/:id/submit',
      {
        schema: {
          tags: ['forms'],
          security: [{ bearerAuth: [] }],
          summary: 'Submit form data',
          params: z.object({
            id: z.string().min(1),
          }),
          body: submitFormBodySchema,
          response: {
            201: submitFormSuccessResponseSchema,
            400: submitFormErrorResponseSchema,
            401: unauthorizedResponseSchema,
            409: submitFormErrorResponseSchema,
            422: submitFormErrorResponseSchema,
            500: internalServerErrorResponseSchema,
          },
        },
      },
      submitFormController,
    );
}
