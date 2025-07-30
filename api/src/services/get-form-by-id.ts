import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import { getFormByIdParamsSchema } from '@/schemas/get-form-by-id';

export class InvalidIdError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'InvalidIdError';
  }
}
export class FormNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'FormNotFoundError';
  }
}

// TODO: implement circular reference detection if needed

export async function getFormByIdService(id: string) {
  const parse = getFormByIdParamsSchema.safeParse({ id });
  if (!parse.success) {
    throw new InvalidIdError('The provided ID is invalid.');
  }

  const repo = new PrismaFormsRepository();
  const form = await repo.findActiveById(id);

  if (!form || !form.versions.length) {
    throw new FormNotFoundError(
      `The form with ID "${id}" was not found or has no versions.`,
    );
  }

  const version = form.versions[0];
  const fields = version.fields as any[];

  return {
    id: form.id,
    name: form.name,
    description: form.description,
    schema_version: Number(version.schema_version),
    createAt: form.createdAt.toISOString(),
    fields: fields.map((f) => {
      const base: any = {
        id: f.id,
        label: f.label,
        type: f.type,
        necessary: f.necessary,
      };
      return base;
    }),
  };
}
