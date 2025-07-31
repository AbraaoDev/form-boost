import { prisma } from '@/lib/prisma';
import { FormValidationService, type Field } from '@/services/form-validation';
import { Parser } from 'expr-eval';

export interface FormSubmissionData {
  id: string;
  answers: Record<string, any>;
  userId: string;
  schemaVersion?: number;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  calculatedValues?: Record<string, any>;
  submissionId?: string;
  executedAt?: string;
}

export class FormSubmissionService {

  static async submitForm(submission: FormSubmissionData): Promise<FormSubmissionResult> {
    try {

      const form = await prisma.form.findFirst({
        where: {
          id: submission.id,
          isActive: true,
          deletedAt: null,
        },
        include: {
          versions: {
            orderBy: { createdAt: 'desc' },
            take: submission.schemaVersion ? 10 : 1, // Buscar mais versões se schema_version especificado
          },
        },
      });

      if (!form) {
        return {
          success: false,
          message: 'Form not found or inactive',
        };
      }


      // 2. Determinar versão do schema
      let targetVersion = form.versions[0];
      if (submission.schemaVersion) {
        const requestedVersion = form.versions.find(v => Number(v.schema_version) === submission.schemaVersion);
        
        if (!requestedVersion) {
          return {
            success: false,
            message: 'Schema version not found',
          };
        }
        
        // Verificar se a versão ainda é aceita para novas submissões
        const currentVersion = Number(form.versions[0].schema_version);
        if (Number(requestedVersion.schema_version) < currentVersion) {
          return {
            success: false,
            message: 'The specified schema version is no longer accepted for new submissions.',
          };
        }
        
        targetVersion = requestedVersion;
      } else {

      }

      const fields = Array.isArray(targetVersion.fields) ? targetVersion.fields : [];
      
      if (fields.length === 0) {
        return {
          success: false,
          message: 'Form does not have any fields defined',
        };
      }


      const typedFields = fields as Field[];
      const visibleFields = this.getVisibleFields(typedFields, submission.answers);

      const requiredFields = visibleFields.filter(f => f.required);
      const missingFields: string[] = [];
      
      for (const field of requiredFields) {
        const value = submission.answers[field.id];
        if (value === undefined || value === null || value === '') {
          missingFields.push(field.id);
        }
      }

      if (missingFields.length > 0) {
        return {
          success: false,
          message: 'Some required fields were not completed.',
          errors: missingFields.map(field => ({
            field,
            message: 'Campo obrigatório não informado.',
          })),
        };
      }


;
      const validationResult = FormValidationService.validateSubmission(typedFields, submission.answers);
      
      if (!validationResult.isValid) {
        return {
          success: false,
          message: 'Inconsistent data detected.',
          errors: validationResult.errors.map(error => ({
            field: error.field,
            message: error.message,
          })),
        };
      }


      const calculatedValues = this.calculateFields(typedFields, submission.answers);

      const submissionRecord = await prisma.formSubmission.create({
        data: {
          form: {
            connect: { id: submission.id }
          },
          user: {
            connect: { id: submission.userId }
          },
          data: {
            ...submission.answers,
            ...calculatedValues,
          },
        },
      });


      const executedAt = new Date().toISOString();

      return {
        success: true,
        message: 'Registration submit successfully.',
        calculatedValues,
        submissionId: submissionRecord.id,
        executedAt,
      };

    } catch (error: any) {
      return {
        success: false,
        message: `Error in process submit: ${error.message}`,
      };
    }
  }

  private static calculateFields(fields: Field[], data: Record<string, any>): Record<string, any> {
    const calculatedValues: Record<string, any> = {};
    
    const calculatedFields = fields.filter(f => f.type === 'calculated');
    
    // (topological sort)
    const sortedFields = this.sortByDependencies(calculatedFields);
    
    for (const field of sortedFields) {
      if (field.type === 'calculated') {
        try {
          const value = this.evaluateFormula(field.formula, {
            ...data,
            ...calculatedValues,
          }, field.precision);
          
          calculatedValues[field.id] = value;
        } catch (error) {
          console.error(`Error in calc field ${field.id}:`, error);
          calculatedValues[field.id] = null;
        }
      }
    }
    
    return calculatedValues;
  }

  private static sortByDependencies(fields: Field[]): Field[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    for (const field of fields) {
      if (field.type === 'calculated') {
        graph.set(field.id, field.dependencies || []);
        inDegree.set(field.id, 0);
      }
    }
    
    for (const field of fields) {
      if (field.type === 'calculated') {
        for (const dep of field.dependencies || []) {
          inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
        }
      }
    }
    
    const queue: string[] = [];
    const result: any[] = [];
    
    for (const field of fields) {
      if ((inDegree.get(field.id) || 0) === 0) {
        queue.push(field.id);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const field = fields.find(f => f.id === current);
      if (field) {
        result.push(field);
      }
      
      for (const neighbor of graph.get(current) || []) {
        inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
        if ((inDegree.get(neighbor) || 0) === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    return result;
  }

 
  private static evaluateFormula(
    formula: string,
    context: Record<string, any>,
    precision?: number,
  ): any {
    try {
      const parser = new Parser();

      parser.functions.if = (condition: boolean, trueValue: any, falseValue: any) => {
        return condition ? trueValue : falseValue;
      };
      
      parser.functions.round = (value: number, p: number = 0) => {
          const factor = Math.pow(10, p);
          return Math.round(value * factor) / factor;
      };
  
      const result = parser.evaluate(formula, context);
  
      if (precision !== undefined && typeof result === 'number' && Number.isFinite(result)) {
        const factor = Math.pow(10, precision);
        return Math.round(result * factor) / factor;
      }
  
      return result;
    } catch (error: any) {

      throw new Error(`Error evaluating formula: ${error.message}`);
    }
  }


  static isFieldVisible(field: Field, data: Record<string, any>): boolean {
    if (!field.conditional) return true;
    
    try {
      const result = this.evaluateFormula(field.conditional, data);
      return Boolean(result);
    } catch {
      return false;
    }
  }


  static getVisibleFields(fields: Field[], data: Record<string, any>): Field[] {
    return fields.filter(field => this.isFieldVisible(field, data));
  }
} 