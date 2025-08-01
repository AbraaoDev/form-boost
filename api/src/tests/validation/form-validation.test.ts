import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const fieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'number', 'date', 'boolean', 'select', 'calculated']),
  required: z.boolean().optional().default(false),
  validations: z.array(z.any()).optional(),
});

const formSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1),
});

describe('Form Validation', () => {
  describe('Validação de Campos', () => {
    it('deve aceitar campo de texto válido', () => {
      const field = {
        id: 'name',
        label: 'Nome',
        type: 'text' as const,
        required: true,
        validations: [
          { type: 'min_length', value: 3 },
          { type: 'max_length', value: 100 },
        ],
      };

      const result = fieldSchema.safeParse(field);
      expect(result.success).toBe(true);
    });

    it('deve aceitar campo calculado', () => {
      const field = {
        id: 'total',
        label: 'Total',
        type: 'calculated' as const,
        formula: 'price * quantity',
        dependencies: ['price', 'quantity'],
        precision: 2,
      };

      const result = fieldSchema.safeParse(field);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar campo sem ID', () => {
      const field = {
        label: 'Nome',
        type: 'text' as const,
        required: true,
      };

      const result = fieldSchema.safeParse(field);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('deve rejeitar tipo de campo inválido', () => {
      const field = {
        id: 'name',
        label: 'Nome',
        type: 'invalid' as any,
        required: true,
      };

      const result = fieldSchema.safeParse(field);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('type');
      }
    });
  });

  describe('Validação de Formulários', () => {
    it('deve aceitar formulário válido', () => {
      const form = {
        name: 'Formulário de Teste',
        description: 'Descrição do formulário',
        fields: [
          {
            id: 'name',
            label: 'Nome',
            type: 'text' as const,
            required: true,
          },
          {
            id: 'age',
            label: 'Idade',
            type: 'number' as const,
            required: false,
          },
        ],
      };

      const result = formSchema.safeParse(form);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar formulário sem nome', () => {
      const form = {
        description: 'Descrição do formulário',
        fields: [
          {
            id: 'name',
            label: 'Nome',
            type: 'text' as const,
            required: true,
          },
        ],
      };

      const result = formSchema.safeParse(form);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('deve rejeitar formulário sem campos', () => {
      const form = {
        name: 'Formulário de Teste',
        description: 'Descrição do formulário',
        fields: [],
      };

      const result = formSchema.safeParse(form);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('fields');
      }
    });

    it('deve rejeitar nome muito longo', () => {
      const form = {
        name: 'A'.repeat(101), // 101 caracteres
        description: 'Descrição do formulário',
        fields: [
          {
            id: 'name',
            label: 'Nome',
            type: 'text' as const,
            required: true,
          },
        ],
      };

      const result = formSchema.safeParse(form);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });
  });

  describe('Validação de Campos Calculados', () => {
    it('deve validar fórmula com dependências', () => {
      const calculatedField = {
        id: 'total',
        label: 'Total',
        type: 'calculated' as const,
        formula: 'price * quantity',
        dependencies: ['price', 'quantity'],
        precision: 2,
      };

      const result = fieldSchema.safeParse(calculatedField);
      expect(result.success).toBe(true);
    });

    it('deve aceitar campo calculado sem dependências', () => {
      const calculatedField = {
        id: 'timestamp',
        label: 'Timestamp',
        type: 'calculated' as const,
        formula: 'now()',
        dependencies: [],
      };

      const result = fieldSchema.safeParse(calculatedField);
      expect(result.success).toBe(true);
    });
  });

  describe('Validação de Campos Condicionais', () => {
    it('deve aceitar campo com condição', () => {
      const conditionalField = {
        id: 'additional_info',
        label: 'Informações Adicionais',
        type: 'text' as const,
        required: false,
        conditional: 'show_additional_info == true',
      };

      const result = fieldSchema.safeParse(conditionalField);
      expect(result.success).toBe(true);
    });
  });

  describe('Validação de Campos Select', () => {
    it('deve aceitar campo select com opções', () => {
      const selectField = {
        id: 'category',
        label: 'Categoria',
        type: 'select' as const,
        required: true,
        multiple: false,
        options: [
          { label: 'Opção 1', value: 'option1' },
          { label: 'Opção 2', value: 'option2' },
        ],
      };

      const result = fieldSchema.safeParse(selectField);
      expect(result.success).toBe(true);
    });

    it('deve aceitar campo select múltiplo', () => {
      const selectField = {
        id: 'tags',
        label: 'Tags',
        type: 'select' as const,
        required: false,
        multiple: true,
        options: [
          { label: 'Tag 1', value: 'tag1' },
          { label: 'Tag 2', value: 'tag2' },
        ],
      };

      const result = fieldSchema.safeParse(selectField);
      expect(result.success).toBe(true);
    });
  });
});
