import { z } from 'zod';

export const listFormSubmissionsParamsSchema = z.object({
  id: z
    .string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID inválido'),
});

export const listFormSubmissionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  length_page: z.coerce.number().int().min(1).max(100).default(20),
  include_calculated: z.coerce.boolean().optional(),
  schema_version: z.coerce.number().int().min(1).optional(),
});

export type ListFormSubmissionsParams = z.infer<typeof listFormSubmissionsParamsSchema>;
export type ListFormSubmissionsQuery = z.infer<typeof listFormSubmissionsQuerySchema>; 