import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { deleteFormSubmissionController } from '@/http/controllers/delete-form-submission';
import { auth } from '@/http/middlewares/auth';
import { requireJson } from '@/http/middlewares/require-json';
import { deleteFormSubmissionParamsSchema } from '@/schemas/delete-form-submission';
import {
  deleteFormSubmissionSuccessResponseSchema,
  formNotFoundErrorResponseSchema,
  submitNotFoundErrorResponseSchema,
  submitAlreadyRemovedErrorResponseSchema,
  inactiveFormErrorResponseSchema,
  submitBlockedErrorResponseSchema,
  unauthorizedResponseSchema,
  validationErrorResponseSchema,
  internalServerErrorResponseSchema,
} from '@/schemas/responses';

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
          response: {
            200: deleteFormSubmissionSuccessResponseSchema,
            400: validationErrorResponseSchema,
            401: unauthorizedResponseSchema,
            403: inactiveFormErrorResponseSchema,
            404: formNotFoundErrorResponseSchema,
            410: submitAlreadyRemovedErrorResponseSchema,
            423: submitBlockedErrorResponseSchema,
            500: internalServerErrorResponseSchema,
          },
        },
      },
      deleteFormSubmissionController,
    );
} 