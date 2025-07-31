import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import { getFormByIdParamsSchema } from '@/schemas/get-form-by-id';
import { FieldValidators } from '@/lib/validators/field-validators';
import { FormValidationService, type Field } from '@/services/form-validation';

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

export class CircularDependencyError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'CircularDependencyError';
  }
}

export async function getFormByIdService(id: string) {
  const parse = getFormByIdParamsSchema.safeParse({ id });
  if (!parse.success) {
    throw new InvalidIdError('The provided ID is invalid.');
  }

  const repo = new PrismaFormsRepository();
  const form = await repo.findActiveById(id);

  if (!form || !form.versions.length) {
    throw new FormNotFoundError(
      `The form with ID "${id}" was not found or is inactive.`,
    );
  }

  const version = form.versions[0];
  const fields = version.fields as Field[];

  // Validar dependências circulares em campos calculated
  const calculatedFields = fields.filter(f => f.type === 'calculated');
  if (calculatedFields.length > 0) {
    const dependencyResult = FieldValidators.validateDependencies(calculatedFields);
    if (!dependencyResult.isValid) {
      console.error(`Circular dependency detected in form ${id}: ${dependencyResult.error}`);
      throw new CircularDependencyError(
        `Circular dependency detected in calculated fields: ${dependencyResult.error}`
      );
    }
  }

  // Validar estrutura dos campos usando FormValidationService
  const validationResult = FormValidationService.validateForm(fields);
  if (!validationResult.isValid) {
    console.error(`Form ${id} has validation errors:`, validationResult.errors);
    // Não falha a requisição, mas registra os erros
  }

  return {
    id: form.id,
    name: form.name,
    description: form.description,
    schema_version: Number(version.schema_version),
    created_at: form.createdAt.toISOString(),
    fields: fields.map((field) => {
      const fieldAny = field as any; // Cast para suportar campos legacy
      const baseField = {
        id: field.id,
        label: field.label,
        type: field.type,
        required: fieldAny.necessary || field.required, // Suporte para ambos os campos
      };

      // Adicionar propriedades específicas por tipo
      switch (field.type) {
        case 'text':
          return {
            ...baseField,
            capitalize: field.capitalize,
            multiline: field.multiline,
            validations: field.validations,
          };

        case 'number':
          return {
            ...baseField,
            format: field.format,
            validations: field.validations,
          };

        case 'boolean':
          return {
            ...baseField,
            validations: field.validations,
          };

        case 'date':
          return {
            ...baseField,
            min: field.min,
            max: field.max,
            validations: field.validations,
          };

        case 'select':
          return {
            ...baseField,
            multiple: field.multiple,
            options: field.options,
            validations: field.validations,
          };

        case 'calculated':
          return {
            ...baseField,
            formula: field.formula,
            dependencies: field.dependencies,
            precision: field.precision,
            validations: field.validations,
          };

        default:
          return baseField;
      }
    }),
  };
}
