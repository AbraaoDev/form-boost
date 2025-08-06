import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import type { CreateFormBody } from '@/schemas/create-form';
import { FormValidationService } from '@/services/form-validation';

export async function createFormService(
  { name, description, fields }: CreateFormBody,
  userId: string,
) {
  const validationResult = FormValidationService.validateForm(fields);

  if (!validationResult.isValid) {
    const errorMessage = validationResult.errors
      .map((error) => `${error.field}: ${error.message}`)
      .join('; ');

    throw new Error(`Validation error: ${errorMessage}`);
  }

  const fieldIds = fields.map((f) => f.id);
  for (const field of fields) {
    if (field.conditional) {
      const conditionalResult =
        FormValidationService.validateConditionalExpression(
          field.conditional,
          fieldIds,
        );

      if (!conditionalResult.isValid) {
        throw new Error(
          `Conditional expression error for field '${field.id}': ${conditionalResult.error}`,
        );
      }
    }
  }

  const prismaFormsRepository = new PrismaFormsRepository();

  const form = await prismaFormsRepository.createForm({
    name,
    description,
    owner: {
      connect: { id: userId },
    },
    versions: {
      create: {
        fields,
        schema_version: '1',
      },
    },
  });

  return {
    id: form.id,
    schema_version: '1',
    message: 'Created form successfully',
    createdAt: form.createdAt,
  };
}
