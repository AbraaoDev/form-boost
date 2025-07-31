import { z } from 'zod';

export const deleteFormSubmissionParamsSchema = z.object({
  id: z
    .string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID inválido'),
  id_submit: z
    .string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID da submissão inválido'),
});

export type DeleteFormSubmissionParams = z.infer<typeof deleteFormSubmissionParamsSchema>; 