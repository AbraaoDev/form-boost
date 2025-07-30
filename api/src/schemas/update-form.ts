import { z } from 'zod';

export const updateParamsSchema = z.object({
  id: z
    .string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID inválido'),
});

const typeValids = [
  'text',
  'number',
  'date',
  'select',
  'boolean',
  'calculated',
] as const;

const optionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const fieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(typeValids),
  necessary: z.boolean().optional(),
  max_length: z.number().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
  calc: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  accuracy: z.number().optional(),
  options: z.array(optionSchema).optional(),
});

export const updateFormSchemaVersionBodySchema = z.object({
  schema_version: z.number().int().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  fields: z.array(fieldSchema).min(1),
});

export type ValidationSchema = z.infer<typeof fieldSchema>;

export type UpdateFormSchemaVersionBody = z.infer<
  typeof updateFormSchemaVersionBodySchema
>;
