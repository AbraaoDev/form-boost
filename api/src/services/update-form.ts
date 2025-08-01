import {
  FormNotFoundError,
  InvalidSchemaError,
  InvalidSchemaVersionError,
} from '@/errors';
import { FieldValidators } from '@/lib/validators/field-validators';
import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import type { UpdateFormSchemaVersionBody } from '@/schemas/update-form';
import { type Field, FormValidationService } from '@/services/form-validation';

export class UpdateFormService {
  async updateFormSchemaVersion(
    formId: string,
    { schema_version, name, description, fields }: UpdateFormSchemaVersionBody,
  ) {
    try {
      const prismaFormsRepository = new PrismaFormsRepository();

      const form = await prismaFormsRepository.findFirstWithVersions(
        { id: formId, isActive: true, deletedAt: null },
        { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
      );

      if (!form) {
        throw new FormNotFoundError('Formulário não encontrado ou inativo.');
      }

      const currentVersion = form.versions[0]?.schema_version
        ? Number(form.versions[0].schema_version)
        : 0;

      if (schema_version <= currentVersion) {
        throw new InvalidSchemaVersionError(schema_version);
      }

      const validationResult = FormValidationService.validateForm(
        fields as Field[],
      );

      if (!validationResult.isValid) {
        const errors = validationResult.errors.map((error) => ({
          field: error.field,
          message: error.message,
        }));

        throw new InvalidSchemaError(errors);
      }

      const calculatedFields = fields.filter((f) => f.type === 'calculated');

      if (calculatedFields.length > 0) {
        const dependencyResult =
          FieldValidators.validateDependencies(calculatedFields);
        if (!dependencyResult.isValid) {
          throw new InvalidSchemaError([
            {
              field: 'form',
              message: dependencyResult.error!,
            },
          ]);
        }
      }

      const updated = await prismaFormsRepository.updateForm(
        { id: formId },
        {
          name,
          description,
          versions: {
            create: {
              fields,
              schema_version: String(schema_version),
            },
          },
        },
        { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
      );

      const result = {
        message: 'Schema version updated successfully.',
        id: formId,
        previous_schema_version: currentVersion,
        new_schema_version: schema_version,
        updated_at: updated.updatedAt ?? new Date(),
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export async function updateFormSchemaVersionService(
  id: string,
  data: UpdateFormSchemaVersionBody,
) {
  const service = new UpdateFormService();
  return service.updateFormSchemaVersion(id, data);
}
