import { z } from 'zod';


export const textValidationSchema = z.object({
  type: z.enum([
    'min_length',
    'max_length',
    'regex',
    'not_contain',
    'not_empty',
  ]),
  value: z.union([z.string(), z.number(), z.array(z.string())]).optional(),
});


export const numberValidationSchema = z.object({
  type: z.enum(['min', 'max', 'multiple_of', 'format', 'not_empty']),
  value: z.union([z.number(), z.string()]).optional(),
});


export const booleanValidationSchema = z.object({
  type: z.enum(['not_empty', 'expected_value', 'blocked_for_false']),
  value: z.union([z.boolean(), z.string()]).optional(),
});

export const dateValidationSchema = z.object({
  type: z.enum([
    'future_date',
    'strict_iso_format',
    'not_empty',
    'before',
  ]),
  value: z.union([z.string(), z.boolean()]).optional(),
  allowed: z.boolean().optional(),
  field: z.string().optional(),
});


export const selectValidationSchema = z.object({
  type: z.enum([
    'in_list',
    'min_count',
    'max_count',
    'required_conditional',
  ]),
  value: z.union([z.number(), z.string()]).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  conditional: z.string().optional(),
});


export const calculatedValidationSchema = z.object({
  type: z.enum([
    'in_list',
    'equal_to',
    'valid_range',
    'valid_date_format',
  ]),
  value: z.any().optional(),
  values: z.array(z.any()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});


export const selectOptionSchema = z.object({
  label: z.string().min(1).max(255),
  value: z.string().min(1).max(100),
});


export const baseFieldSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(50)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'ID must be alphanumeric and without spaces or symbols',
    ),
  label: z.string().min(1).max(255),
  type: z.enum(['text', 'number', 'date', 'select', 'boolean', 'calculated']),
  required: z.boolean(),
  conditional: z.string().optional(),
  validations: z.array(z.any()).optional(),
});


export const textFieldSchema = baseFieldSchema.extend({
  type: z.literal('text'),
  capitalize: z.boolean().optional(),
  multiline: z.boolean().optional(),
  validations: z.array(textValidationSchema).optional(),
});

export const numberFieldSchema = baseFieldSchema.extend({
  type: z.literal('number'),
  format: z.enum(['integer', 'decimal']).optional(),
  validations: z.array(numberValidationSchema).optional(),
});


export const booleanFieldSchema = baseFieldSchema.extend({
  type: z.literal('boolean'),
  validations: z.array(booleanValidationSchema).optional(),
});


export const dateFieldSchema = baseFieldSchema.extend({
  type: z.literal('date'),
  min: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  max: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  validations: z.array(dateValidationSchema).optional(),
});


export const selectFieldSchema = baseFieldSchema.extend({
  type: z.literal('select'),
  multiple: z.boolean().default(false),
  options: z.array(selectOptionSchema).min(1).max(100),
  validations: z.array(selectValidationSchema).optional(),
});


export const calculatedFieldSchema = baseFieldSchema.extend({
  type: z.literal('calculated'),
  formula: z.string().min(1),
  dependencies: z.array(z.string()).min(1),
  precision: z.number().int().min(0).max(10).optional(),
  validations: z.array(calculatedValidationSchema).optional(),
});


export const fieldSchema = z.discriminatedUnion('type', [
  textFieldSchema,
  numberFieldSchema,
  booleanFieldSchema,
  dateFieldSchema,
  selectFieldSchema,
  calculatedFieldSchema,
]);

// Functions for field validations specific	
export class FieldValidators {
  //regex
  static validateRegex(pattern: string): boolean {
    try {
      new RegExp(pattern);
      return true;
    } catch {
      return false;
    }
  }

  // ISO date
  static validateISODate(dateString: string): boolean {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date.toISOString().split('T')[0] === dateString;
  }

  // Circular dependencies
  static validateDependencies(
    fields: Array<{ id: string; dependencies?: string[] }>,
  ): { isValid: boolean; error?: string } {
    const graph = new Map<string, string[]>();
    
    // graph
    fields.forEach((field) => {
      if (field.dependencies) {
        graph.set(field.id, field.dependencies);
      }
    });

    // DFS
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (node: string): boolean => {
      if (recStack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      recStack.add(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true;
      }

      recStack.delete(node);
      return false;
    };

    for (const node of graph.keys()) {
      if (hasCycle(node)) {
        return {
          isValid: false,
          error: `Circular dependency detected involving the field '${node}'`,
        };
      }
    }

    return { isValid: true };
  }

  // Formula
  static validateFormula(
    formula: string,
    dependencies: string[],
    allFieldIds: string[],
  ): { isValid: boolean; error?: string } {
    for (const dep of dependencies) {
      if (!allFieldIds.includes(dep)) {
        return {
          isValid: false,
          error: `Dependency '${dep}' not found in the form fields`,
        };
      }
    }

    const allowedChars = /^[a-zA-Z0-9_+\-*\/^()\s.,>=<!=&|]+$/;
    if (!allowedChars.test(formula)) {
      return {
        isValid: false,
        error: 'Formula contains invalid characters',
      };
    }

    const variableRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const variables = formula.match(variableRegex) || [];
    
    for (const variable of variables) {
      if (!dependencies.includes(variable) && 
          !['if', 'min', 'max', 'abs', 'sqrt', 'log', 'ceil', 'floor', 'round'].includes(variable)) {
        return {
          isValid: false,
          error: `Variable '${variable}' is not in the dependencies of the field`,
        };
      }
    }

    return { isValid: true };
  }

  // Date range
  static validateDateRange(min?: string, max?: string): { isValid: boolean; error?: string } {
    if (min && max) {
      const minDate = new Date(min);
      const maxDate = new Date(max);
      
      if (minDate > maxDate) {
        return {
          isValid: false,
          error: 'Minimum date cannot be greater than the maximum date',
        };
      }
    }
    
    return { isValid: true };
  }

  // Number range
  static validateNumberRange(min?: number, max?: number): { isValid: boolean; error?: string } {
    if (min !== undefined && max !== undefined && min > max) {
      return {
        isValid: false,
        error: 'Minimum number cannot be greater than the maximum number',
      };
    }
    
    return { isValid: true };
  }
} 