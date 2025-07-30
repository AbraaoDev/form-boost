import { z } from 'zod';

export const getFormByIdParamsSchema = z.object({
  id: z
    .string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID inválido'),
});

export type GetFormByIdParams = z.infer<typeof getFormByIdParamsSchema>;
