import { z } from 'zod';
import { fieldSchema } from '@/lib/validators/field-validators';

export const updateParamsSchema = z.object({
  id: z
    .string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID inválido'),
});

export const updateFormSchemaVersionBodySchema = z.object({
  schema_version: z.number().int().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  fields: z.array(fieldSchema).min(1),
});

export type UpdateFormSchemaVersionBody = z.infer<
  typeof updateFormSchemaVersionBodySchema
>;
