import { prisma } from '@/lib/prisma';
import type { CreateFormBody } from '@/schemas/create-form';

export async function createFormService(
  { name, description, fields }: CreateFormBody,
  userId: string,
) {
  const form = await prisma.form.create({
    data: {
      name,
      description,
      userId,
      versions: {
        create: {
          fields,
          schema_version: '1',
        },
      },
    },
    include: {
      versions: true,
    },
  });

  return {
    id: form.id,
    schema_version: '1',
    message: 'Created form successfully',
    createdAt: form.createdAt,
  };
}
