import { z } from 'zod';

const typeValids = [
  'text',
  'number',
  'date',
  'select',
  'boolean',
  'calculated',
] as const;

const validationSchema = z.object({
  type: z.string().min(1),
  value: z.any(),
});

const fieldSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(50)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'ID deve ser alfanumérico e sem espaços ou símbolos',
    ),
  label: z.string().min(1).max(255),
  type: z.enum(typeValids),
  necessary: z.boolean(),
  captilize: z.boolean().optional(),
  multirow: z.boolean().optional(),
  format: z.string().optional(),
  validations: z.array(validationSchema).optional(),
  condition: z.string().optional(),
});

export const createFormBodySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(500).optional(),
  fields: z
    .array(fieldSchema)
    .min(1)
    .max(100)
    .refine(
      (fields) => {
        const ids = fields.map((c) => c.id);
        return new Set(ids).size === ids.length;
      },
      { message: 'IDs dos campos devem ser únicos.' },
    ),
});

export type CreateFormBody = z.infer<typeof createFormBodySchema>;
