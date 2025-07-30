import { prisma } from '@/lib/prisma';
import type {
  UpdateFormSchemaVersionBody,
  ValidationSchema,
} from '@/schemas/update-form';

export class FormNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'FormNotFoundError';
  }
}

export class InvalidSchemaVersionError extends Error {
  constructor(version: number) {
    super(`${version} is not a valid schema version.`);
    this.name = 'InvalidSchemaVersionError';
  }
}

export class InvalidSchemaError extends Error {
  status = 422;
  err = 'invalid_schema';
  errors: { field: string; message: string }[];
  constructor(errors: { field: string; message: string }[]) {
    super('Error in schema validation');
    this.errors = errors;
  }
}

function checkDependencies(
  fields: ValidationSchema[],
): { field: string; message: string }[] {
  const ids = fields.map((c) => c.id);
  const errors: { field: string; message: string }[] = [];

  for (const field of fields) {
    if (field.dependencies) {
      for (const dep of field.dependencies) {
        if (!ids.includes(dep)) {
          errors.push({
            field: field.id,
            message: `Dependencie "${dep}" not found in field "${field.id}".`,
          });
        }
      }
    }
    if (field.type === 'select' && field.options) {
      const values = field.options.map((o) => o.value);
      if (new Set(values).size !== values.length) {
        errors.push({
          field: field.id,
          message: "Values in 'options' must be unique.",
        });
      }
    }
  }
  // TODO: Detectar ciclos em campos calculated, se necessário
  return errors;
}

export async function updateFormSchemaVersionService(
  formId: string,
  { schema_version, name, description, fields }: UpdateFormSchemaVersionBody,
) {
  const form = await prisma.form.findFirst({
    where: { id: formId, isActive: true, deletedAt: null },
    include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  if (!form) throw new FormNotFoundError('Form not found or inactive.');

  const currentVersion = form.versions[0]?.schema_version
    ? Number(form.versions[0].schema_version)
    : 0;

  if (schema_version <= currentVersion) {
    throw new InvalidSchemaVersionError(schema_version);
  }

  const errors = checkDependencies(fields);

  if (errors.length > 0) {
    throw new InvalidSchemaError(errors);
  }

  const updated = await prisma.form.update({
    where: { id: formId },
    data: {
      name,
      description,
      versions: {
        create: {
          fields,
          schema_version: String(schema_version),
        },
      },
    },
    include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  return {
    message: 'Version updated successfully',
    id: formId,
    old_version_schema_: currentVersion,
    new_version_schema: schema_version,
    updatedAt: updated.updatedAt ?? new Date(),
  };
}
