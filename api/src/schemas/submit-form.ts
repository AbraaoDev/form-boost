import { z } from 'zod';

export const submitFormBodySchema = z.object({
  schema_version: z.number().int().min(1).optional(),
  answers: z.record(z.string(), z.any()),
});

export type SubmitFormBody = z.infer<typeof submitFormBodySchema>;
