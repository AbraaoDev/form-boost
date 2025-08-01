import { z } from 'zod';

export const errorResponseSchema = z.object({
  message: z.string(),
});

export const unauthorizedResponseSchema = z.object({
  message: z.string().default('Unauthorized'),
});

export const validationErrorResponseSchema = z.object({
  error: z.string().default('VALIDATION_ERROR'),
  message: z.string().default('Validation error'),
  issues: z.any().optional(),
});

export const internalServerErrorResponseSchema = z.object({
  error: z.string().default('INTERNAL_SERVER_ERROR'),
  message: z.string().default('Internal server error'),
});

export const authenticateSuccessResponseSchema = z.object({
  token: z.string(),
});

export const logoutSuccessResponseSchema = z.object({
  message: z.string().default('Logged out successfully'),
});

export const logoutErrorResponseSchema = z.object({
  message: z.string().default('No active session found'),
});

export const formResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  schema: z.any(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createFormSuccessResponseSchema = formResponseSchema;

export const listFormsResponseSchema = z.object({
  forms: z.array(formResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_pages: z.number(),
  }),
});

export const submitFormSuccessResponseSchema = z.object({
  message: z.string(),
  id_submit: z.string(),
  calculated: z.record(z.string(), z.any()),
  executed_at: z.string(),
});

export const submitFormErrorResponseSchema = z.object({
  error: z.enum(['schema_outdated', 'business_inconsistency', 'failed_validation']),
  message: z.string(),
  errors: z.array(z.any()).optional(),
});

export const formSubmissionResponseSchema = z.object({
  id: z.string(),
  form_id: z.string(),
  answers: z.record(z.string(), z.any()),
  calculated_values: z.record(z.string(), z.any()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const listFormSubmissionsResponseSchema = z.object({
  submissions: z.array(formSubmissionResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_pages: z.number(),
  }),
});

export const deleteFormSubmissionSuccessResponseSchema = z.object({
  message: z.string(),
  status: z.string(),
});

export const formNotFoundErrorResponseSchema = z.object({
  erro: z.string().default('form_not_found'),
  mensagem: z.string(),
});

export const submitNotFoundErrorResponseSchema = z.object({
  error: z.string().default('submit_not_found'),
  message: z.string(),
});

export const submitAlreadyRemovedErrorResponseSchema = z.object({
  error: z.string().default('submit_already_removed'),
  message: z.string(),
});

export const inactiveFormErrorResponseSchema = z.object({
  error: z.string().default('inactive_form'),
  message: z.string(),
});

export const submitBlockedErrorResponseSchema = z.object({
  erro: z.string().default('submit_blocked'),
  mensagem: z.string(),
});

export const invalidParamErrorResponseSchema = z.object({
  error: z.string().default('invalid_params'),
  message: z.string(),
  field: z.string().optional(),
});

export const invalidPageErrorResponseSchema = z.object({
  error: z.string().default('invalid_page'),
  message: z.string(),
});

export const userAlreadyExistsErrorResponseSchema = z.object({
  message: z.string(),
}); 