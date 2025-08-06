import { z } from 'zod';

export const allowedOrderBy = ['name', 'createdAt'] as const;
export const allowedOrder = ['asc', 'desc'] as const;

export const listFormsQuerySchema = z.object({
  name: z.string().optional(),
  schema_version: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  length_page: z.coerce.number().int().min(1).max(100).default(20),
  orderBy: z.enum(allowedOrderBy).optional(),
  order: z.enum(allowedOrder).optional(),
  include_inactives: z.coerce.boolean().optional(),
});

export type ListFormsQuery = z.infer<typeof listFormsQuerySchema>;
