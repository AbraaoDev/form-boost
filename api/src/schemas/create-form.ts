import { z } from 'zod';
import { fieldSchema } from '@/lib/validators/field-validators';

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
      { message: 'Field IDs must be unique.' },
    ),
});

export type CreateFormBody = z.infer<typeof createFormBodySchema>;
