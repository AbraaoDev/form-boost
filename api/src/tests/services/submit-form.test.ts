import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaFormSubmissionsRepository } from '@/repositories/prisma-form-submissions-repository';
import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import { FormSubmissionService } from '@/services/submit-form';

// Mock dos repositories
vi.mock('@/repositories/prisma-forms-repository');
vi.mock('@/repositories/prisma-form-submissions-repository');

describe('SubmitFormService', () => {
  let mockFormsRepository: any;
  let mockSubmissionsRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormsRepository = {
      findFirstWithVersions: vi.fn(),
    };
    mockSubmissionsRepository = {
      create: vi.fn(),
    };
    vi.mocked(PrismaFormsRepository).mockImplementation(
      () => mockFormsRepository,
    );
    vi.mocked(PrismaFormSubmissionsRepository).mockImplementation(
      () => mockSubmissionsRepository,
    );
  });

  describe('Validações', () => {
    it('deve retornar erro quando formulário não existe', async () => {
      mockFormsRepository.findFirstWithVersions.mockResolvedValue(null);

      const formId = 'form-inexistente';
      const userId = 'user-123';
      const data = {
        name: 'Test User',
        age: 25,
      };

      const result = await FormSubmissionService.submitForm({
        id: formId,
        answers: data,
        userId,
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Form not found or inactive');
    });

    it('deve retornar erro quando formulário está inativo', async () => {
      mockFormsRepository.findFirstWithVersions.mockResolvedValue(null);

      const formId = 'form-inativo';
      const userId = 'user-123';
      const data = {
        name: 'Test User',
        age: 25,
      };

      const result = await FormSubmissionService.submitForm({
        id: formId,
        answers: data,
        userId,
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Form not found or inactive');
    });

    it('deve retornar erro quando formulário não tem campos', async () => {
      const formWithoutFields = {
        id: 'form-sem-campos',
        name: 'Formulário Sem Campos',
        isActive: true,
        versions: [
          {
            id: 'version-1',
            schema_version: '1',
            fields: [],
          },
        ],
      };

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(
        formWithoutFields,
      );

      const formId = 'form-sem-campos';
      const userId = 'user-123';
      const data = {
        name: 'Test User',
        age: 25,
      };

      const result = await FormSubmissionService.submitForm({
        id: formId,
        answers: data,
        userId,
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Form does not have any fields defined');
    });
  });

  describe('Submissão bem-sucedida', () => {
    it('deve criar submissão com dados válidos', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário de Teste',
        isActive: true,
        versions: [
          {
            id: 'version-1',
            schema_version: '1',
            fields: [
              {
                id: 'name',
                label: 'Nome',
                type: 'text',
                required: true,
              },
              {
                id: 'age',
                label: 'Idade',
                type: 'number',
                required: false,
              },
            ],
          },
        ],
      };

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.create.mockResolvedValue({
        id: 'submission-123',
        formId: 'form-123',
        userId: 'user-123',
        data: {
          name: 'João Silva',
          age: 30,
        },
        createdAt: new Date(),
      });

      const formId = 'form-123';
      const userId = 'user-123';
      const data = {
        name: 'João Silva',
        age: 30,
      };

      const result = await FormSubmissionService.submitForm({
        id: formId,
        answers: data,
        userId,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Registration submit successfully.');
      expect(result.submissionId).toBeDefined();
    });

    it('deve processar campos calculados corretamente', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário com Campos Calculados',
        isActive: true,
        versions: [
          {
            id: 'version-1',
            schema_version: '1',
            fields: [
              {
                id: 'price',
                label: 'Preço',
                type: 'number',
                required: true,
              },
              {
                id: 'quantity',
                label: 'Quantidade',
                type: 'number',
                required: true,
              },
              {
                id: 'total',
                label: 'Total',
                type: 'calculated',
                formula: 'price * quantity',
                dependencies: ['price', 'quantity'],
              },
            ],
          },
        ],
      };

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.create.mockResolvedValue({
        id: 'submission-123',
        formId: 'form-123',
        userId: 'user-123',
        data: {
          price: 10,
          quantity: 5,
          total: 50,
        },
        createdAt: new Date(),
      });

      const formId = 'form-123';
      const userId = 'user-123';
      const data = {
        price: 10,
        quantity: 5,
      };

      const result = await FormSubmissionService.submitForm({
        id: formId,
        answers: data,
        userId,
      });

      expect(result.success).toBe(true);
      expect(result.calculatedValues).toBeDefined();
      expect(result.calculatedValues?.total).toBe(50);
    });
  });

  describe('Validação de dados', () => {
    it('deve validar campos obrigatórios', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário com Campos Obrigatórios',
        isActive: true,
        versions: [
          {
            id: 'version-1',
            schema_version: '1',
            fields: [
              {
                id: 'name',
                label: 'Nome',
                type: 'text',
                required: true,
              },
              {
                id: 'email',
                label: 'Email',
                type: 'text',
                required: true,
              },
            ],
          },
        ],
      };

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);

      const formId = 'form-123';
      const userId = 'user-123';
      const data = {
        name: 'João Silva',
        // email está faltando
      };

      const result = await FormSubmissionService.submitForm({
        id: formId,
        answers: data,
        userId,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('deve aceitar campos opcionais vazios', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário com Campos Opcionais',
        isActive: true,
        versions: [
          {
            id: 'version-1',
            schema_version: '1',
            fields: [
              {
                id: 'name',
                label: 'Nome',
                type: 'text',
                required: true,
              },
              {
                id: 'notes',
                label: 'Observações',
                type: 'text',
                required: false,
              },
            ],
          },
        ],
      };

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.create.mockResolvedValue({
        id: 'submission-123',
        formId: 'form-123',
        userId: 'user-123',
        data: {
          name: 'João Silva',
        },
        createdAt: new Date(),
      });

      const formId = 'form-123';
      const userId = 'user-123';
      const data = {
        name: 'João Silva',
        // notes não está presente, mas é opcional
      };

      const result = await FormSubmissionService.submitForm({
        id: formId,
        answers: data,
        userId,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Registration submit successfully.');
    });
  });

  describe('Campos condicionais', () => {
    it('deve processar campos condicionais baseados em outros campos', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário com Campos Condicionais',
        isActive: true,
        versions: [
          {
            id: 'version-1',
            schema_version: '1',
            fields: [
              {
                id: 'has_company',
                label: 'Possui empresa?',
                type: 'boolean',
                required: true,
              },
              {
                id: 'company_name',
                label: 'Nome da empresa',
                type: 'text',
                required: false,
                conditional: 'has_company == true',
              },
            ],
          },
        ],
      };

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.create.mockResolvedValue({
        id: 'submission-123',
        formId: 'form-123',
        userId: 'user-123',
        data: {
          has_company: true,
          company_name: 'Tech Solutions',
        },
        createdAt: new Date(),
      });

      const formId = 'form-123';
      const userId = 'user-123';
      const data = {
        has_company: true,
        company_name: 'Tech Solutions',
      };

      const result = await FormSubmissionService.submitForm({
        id: formId,
        answers: data,
        userId,
      });

      expect(result.success).toBe(true);
    });
  });
});
