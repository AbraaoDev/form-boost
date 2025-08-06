import type { z } from 'zod';
import {
  type booleanFieldSchema,
  type booleanValidationSchema,
  type calculatedFieldSchema,
  type calculatedValidationSchema,
  type dateFieldSchema,
  type dateValidationSchema,
  FieldValidators,
  fieldSchema,
  type numberFieldSchema,
  type numberValidationSchema,
  type selectFieldSchema,
  type selectValidationSchema,
  type textFieldSchema,
  type textValidationSchema,
} from '@/lib/validators/field-validators';

export type TextField = z.infer<typeof textFieldSchema>;
export type NumberField = z.infer<typeof numberFieldSchema>;
export type BooleanField = z.infer<typeof booleanFieldSchema>;
export type DateField = z.infer<typeof dateFieldSchema>;
export type SelectField = z.infer<typeof selectFieldSchema>;
export type CalculatedField = z.infer<typeof calculatedFieldSchema>;
export type Field = z.infer<typeof fieldSchema>;

export type TextValidation = z.infer<typeof textValidationSchema>;
export type NumberValidation = z.infer<typeof numberValidationSchema>;
export type BooleanValidation = z.infer<typeof booleanValidationSchema>;
export type DateValidation = z.infer<typeof dateValidationSchema>;
export type SelectValidation = z.infer<typeof selectValidationSchema>;
export type CalculatedValidation = z.infer<typeof calculatedValidationSchema>;

export interface ValidationError {
  field: string;
  message: string;
  type: 'schema' | 'business' | 'dependency';
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class FormValidationService {
  static validateForm(fields: Field[]): FormValidationResult {
    const errors: ValidationError[] = [];

    // 1. Basic schema validation
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const result = fieldSchema.safeParse(field);

      if (!result.success) {
        errors.push({
          field: field.id || `field${i}`,
          message: `Schema error: ${result.error.issues[0]?.message || 'Invalid field'}`,
          type: 'schema',
        });
        continue;
      }

      // 2. Specific validations by type
      const fieldErrors = FormValidationService.validateFieldByType(
        field,
        fields,
      );
      errors.push(...fieldErrors);
    }

    // 3. Transversal validations
    const transversalErrors =
      FormValidationService.validateTransversalRules(fields);
    errors.push(...transversalErrors);

    // 4. Circular dependencies validation
    const calculatedFields = fields.filter((f) => f.type === 'calculated');
    if (calculatedFields.length > 0) {
      const dependencyResult =
        FieldValidators.validateDependencies(calculatedFields);
      if (!dependencyResult.isValid) {
        errors.push({
          field: 'form',
          message: dependencyResult.error!,
          type: 'dependency',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private static validateFieldByType(
    field: Field,
    allFields: Field[],
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    switch (field.type) {
      case 'text':
        errors.push(...FormValidationService.validateTextField(field));
        break;
      case 'number':
        errors.push(...FormValidationService.validateNumberField(field));
        break;
      // case 'boolean':
      //   errors.push(...this.validateBooleanField(field));
      //   break;
      case 'date':
        errors.push(...FormValidationService.validateDateField(field));
        break;
      case 'select':
        errors.push(...FormValidationService.validateSelectField(field));
        break;
      case 'calculated':
        errors.push(
          ...FormValidationService.validateCalculatedField(field, allFields),
        );
        break;
    }

    return errors;
  }

  private static validateTextField(field: TextField): ValidationError[] {
    const errors: ValidationError[] = [];

    if (field.validations) {
      for (const validation of field.validations) {
        if (
          validation.type === 'regex' &&
          typeof validation.value === 'string'
        ) {
          if (!FieldValidators.validateRegex(validation.value)) {
            errors.push({
              field: field.id,
              message: `Invalid regex: ${validation.value}`,
              type: 'business',
            });
          }
        }
      }
    }

    return errors;
  }

  private static validateNumberField(field: NumberField): ValidationError[] {
    const errors: ValidationError[] = [];

    if (field.validations) {
      let min: number | undefined;
      let max: number | undefined;

      for (const validation of field.validations) {
        if (validation.type === 'min' && typeof validation.value === 'number') {
          min = validation.value;
        }
        if (validation.type === 'max' && typeof validation.value === 'number') {
          max = validation.value;
        }
      }

      const rangeResult = FieldValidators.validateNumberRange(min, max);
      if (!rangeResult.isValid) {
        errors.push({
          field: field.id,
          message: rangeResult.error!,
          type: 'business',
        });
      }
    }

    return errors;
  }

  // private static validateBooleanField(field: any): ValidationError[] {
  //   const errors: ValidationError[] = [];
  //   // As validações serão aplicadas durante a submissão

  //   return errors;
  // }

  private static validateDateField(field: DateField): ValidationError[] {
    const errors: ValidationError[] = [];

    const rangeResult = FieldValidators.validateDateRange(field.min, field.max);
    if (!rangeResult.isValid) {
      errors.push({
        field: field.id,
        message: rangeResult.error!,
        type: 'business',
      });
    }

    return errors;
  }

  private static validateSelectField(field: SelectField): ValidationError[] {
    const errors: ValidationError[] = [];

    if (field.options) {
      const values = field.options.map((opt) => opt.value);
      const uniqueValues = new Set(values);

      if (values.length !== uniqueValues.size) {
        errors.push({
          field: field.id,
          message: 'Select options must have unique values',
          type: 'business',
        });
      }

      if (field.options.length === 0) {
        errors.push({
          field: field.id,
          message: 'Select field must have at least one option',
          type: 'business',
        });
      }
    }

    return errors;
  }

  private static validateCalculatedField(
    field: CalculatedField,
    allFields: Field[],
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (field.formula && field.dependencies) {
      const allFieldIds = FormValidationService.getAllFieldIds(allFields);
      const formulaResult = FieldValidators.validateFormula(
        field.formula,
        field.dependencies,
        allFieldIds,
      );

      if (!formulaResult.isValid) {
        errors.push({
          field: field.id,
          message: formulaResult.error!,
          type: 'business',
        });
      }
    }

    return errors;
  }

  private static validateTransversalRules(fields: Field[]): ValidationError[] {
    const errors: ValidationError[] = [];

    const ids = fields.map((f) => f.id);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      errors.push({
        field: 'form',
        message: 'Fields IDs must be unique',
        type: 'business',
      });
    }

    const reservedNames = ['id', 'form', 'submit', 'action', 'method'];
    for (const field of fields) {
      if (reservedNames.includes(field.id)) {
        errors.push({
          field: field.id,
          message: `ID '${field.id}' is reserved and cannot be used`,
          type: 'business',
        });
      }
    }

    return errors;
  }

  private static getAllFieldIds(fields: Field[]): string[] {
    return fields.map((field) => field.id);
  }

  static validateConditionalExpression(
    expression: string,
    availableFields: string[],
  ): { isValid: boolean; error?: string } {
    if (!expression) return { isValid: true };

    const variableRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const variables = expression.match(variableRegex) || [];

    for (const variable of variables) {
      if (
        !availableFields.includes(variable) &&
        !['true', 'false', 'null', 'undefined'].includes(variable)
      ) {
        return {
          isValid: false,
          error: `Variable '${variable}' not found in the form fields`,
        };
      }
    }

    const allowedChars = /^[a-zA-Z0-9_+\-*/^()\s.,>=<!=&|'"]+$/;
    if (!allowedChars.test(expression)) {
      return {
        isValid: false,
        error: 'Conditional expression contains invalid characters',
      };
    }

    return { isValid: true };
  }

  static validateSubmission(
    formFields: Field[],
    submittedData: Record<string, any>,
  ): FormValidationResult {
    const errors: ValidationError[] = [];

    for (const field of formFields) {
      const value = submittedData[field.id];

      if (
        field.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push({
          field: field.id,
          message: `field '${field.label}' is required`,
          type: 'business',
        });
        continue;
      }

      if (value !== undefined && value !== null) {
        const fieldErrors = FormValidationService.validateFieldValue(
          field,
          value,
        );
        errors.push(...fieldErrors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private static validateFieldValue(
    field: Field,
    value: any,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    switch (field.type) {
      case 'text':
        errors.push(...FormValidationService.validateTextValue(field, value));
        break;
      case 'number':
        errors.push(...FormValidationService.validateNumberValue(field, value));
        break;
      case 'boolean':
        errors.push(
          ...FormValidationService.validateBooleanValue(field, value),
        );
        break;
      case 'date':
        errors.push(...FormValidationService.validateDateValue(field, value));
        break;
      case 'select':
        errors.push(...FormValidationService.validateSelectValue(field, value));
        break;
      case 'calculated':
        errors.push(
          ...FormValidationService.validateCalculatedValue(field, value),
        );
        break;
    }

    return errors;
  }

  private static validateTextValue(
    field: TextField,
    value: string,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof value !== 'string') {
      errors.push({
        field: field.id,
        message: 'Value must be a string',
        type: 'business',
      });
      return errors;
    }

    if (field.validations) {
      for (const validation of field.validations) {
        switch (validation.type) {
          case 'min_length':
            if (
              typeof validation.value === 'number' &&
              value.length < validation.value
            ) {
              errors.push({
                field: field.id,
                message: `Text must have at least ${validation.value} characters`,
                type: 'business',
              });
            }
            break;
          case 'max_length':
            if (
              typeof validation.value === 'number' &&
              value.length > validation.value
            ) {
              errors.push({
                field: field.id,
                message: `Text must have at most ${validation.value} characters`,
                type: 'business',
              });
            }
            break;
          case 'regex':
            if (typeof validation.value === 'string') {
              try {
                const regex = new RegExp(validation.value);
                if (!regex.test(value)) {
                  errors.push({
                    field: field.id,
                    message: `Value does not match the expected pattern`,
                    type: 'business',
                  });
                }
              } catch {
                errors.push({
                  field: field.id,
                  message: `Invalid regex: ${validation.value}`,
                  type: 'business',
                });
              }
            }
            break;
          case 'not_contain': {
            const forbiddenTerms = Array.isArray(validation.value)
              ? validation.value
              : [validation.value];
            for (const term of forbiddenTerms) {
              if (
                typeof term === 'string' &&
                value.toLowerCase().includes(term.toLowerCase())
              ) {
                errors.push({
                  field: field.id,
                  message: `Text cannot contain '${term}'`,
                  type: 'business',
                });
              }
            }
            break;
          }
          case 'not_empty':
            if (!value.trim()) {
              errors.push({
                field: field.id,
                message: 'Field cannot be empty',
                type: 'business',
              });
            }
            break;
        }
      }
    }

    return errors;
  }

  private static validateNumberValue(
    field: NumberField,
    value: any,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    const numValue = Number(value);
    if (isNaN(numValue)) {
      errors.push({
        field: field.id,
        message: 'Value must be a valid number',
        type: 'business',
      });
      return errors;
    }

    if (field.format === 'integer' && !Number.isInteger(numValue)) {
      errors.push({
        field: field.id,
        message: 'Value must be an integer',
        type: 'business',
      });
    }

    if (field.validations) {
      for (const validation of field.validations) {
        switch (validation.type) {
          case 'min':
            if (
              typeof validation.value === 'number' &&
              numValue < validation.value
            ) {
              errors.push({
                field: field.id,
                message: `Value must be greater than or equal to ${validation.value}`,
                type: 'business',
              });
            }
            break;
          case 'max':
            if (
              typeof validation.value === 'number' &&
              numValue > validation.value
            ) {
              errors.push({
                field: field.id,
                message: `Value must be less than or equal to ${validation.value}`,
                type: 'business',
              });
            }
            break;
          case 'multiple_of':
            if (typeof validation.value === 'number') {
              const remainder = Math.abs(numValue % validation.value);
              if (remainder > 1e-6) {
                errors.push({
                  field: field.id,
                  message: `Value must be a multiple of ${validation.value}`,
                  type: 'business',
                });
              }
            }
            break;
        }
      }
    }

    return errors;
  }

  private static validateBooleanValue(
    field: BooleanField,
    value: any,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof value !== 'boolean') {
      errors.push({
        field: field.id,
        message: 'Value must be true or false',
        type: 'business',
      });
      return errors;
    }

    if (field.validations) {
      for (const validation of field.validations) {
        switch (validation.type) {
          case 'expected_value':
            if (value !== validation.value) {
              errors.push({
                field: field.id,
                message: `Value must be ${validation.value}`,
                type: 'business',
              });
            }
            break;
          case 'blocked_for_false':
            if (value === false) {
              errors.push({
                field: field.id,
                message: 'This field cannot be marked as false',
                type: 'business',
              });
            }
            break;
        }
      }
    }

    return errors;
  }

  private static validateDateValue(
    field: DateField,
    value: any,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof value !== 'string') {
      errors.push({
        field: field.id,
        message: 'Value must be a string in the format YYYY-MM-DD',
        type: 'business',
      });
      return errors;
    }

    if (!FieldValidators.validateISODate(value)) {
      errors.push({
        field: field.id,
        message: 'Value must be a string in the format YYYY-MM-DD',
        type: 'business',
      });
      return errors;
    }

    const dateValue = new Date(value);

    if (field.min) {
      const minDate = new Date(field.min);
      if (dateValue < minDate) {
        errors.push({
          field: field.id,
          message: `Value must be after ${field.min}`,
          type: 'business',
        });
      }
    }

    if (field.max) {
      const maxDate = new Date(field.max);
      if (dateValue > maxDate) {
        errors.push({
          field: field.id,
          message: `Value must be before ${field.max}`,
          type: 'business',
        });
      }
    }

    if (field.validations) {
      for (const validation of field.validations) {
        switch (validation.type) {
          case 'future_date': {
            const now = new Date();
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            );
            if (validation.allowed === false && dateValue > today) {
              errors.push({
                field: field.id,
                message: 'Future dates are not allowed',
                type: 'business',
              });
            }
            break;
          }
        }
      }
    }

    return errors;
  }

  private static validateSelectValue(
    field: SelectField,
    value: any,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    const validValues = field.options.map((opt: any) => opt.value);

    if (field.multiple) {
      if (!Array.isArray(value)) {
        errors.push({
          field: field.id,
          message: 'Value must be an array of strings',
          type: 'business',
        });
        return errors;
      }

      for (const val of value) {
        if (!validValues.includes(val)) {
          errors.push({
            field: field.id,
            message: `Value '${val}' is not a valid option`,
            type: 'business',
          });
        }
      }

      const uniqueValues = new Set(value);
      if (value.length !== uniqueValues.size) {
        errors.push({
          field: field.id,
          message: 'Values cannot be duplicated',
          type: 'business',
        });
      }
    } else {
      if (typeof value !== 'string') {
        errors.push({
          field: field.id,
          message: 'Value must be a string',
          type: 'business',
        });
        return errors;
      }

      if (!validValues.includes(value)) {
        errors.push({
          field: field.id,
          message: `Value '${value}' is not a valid option`,
          type: 'business',
        });
      }
    }

    return errors;
  }

  private static validateCalculatedValue(
    field: CalculatedField,
    value: any,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (value !== undefined) {
      errors.push({
        field: field.id,
        message: 'Calculated fields cannot be submitted manually',
        type: 'business',
      });
    }

    return errors;
  }
}
