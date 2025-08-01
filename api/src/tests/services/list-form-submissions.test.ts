import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaFormSubmissionsRepository } from '@/repositories/prisma-form-submissions-repository';
import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import { listFormSubmissionsService } from '@/services/list-form-submissions';

// Mock dos repositories
vi.mock('@/repositories/prisma-forms-repository');
vi.mock('@/repositories/prisma-form-submissions-repository');

describe('ListFormSubmissionsService', () => {
  let mockFormsRepository: any;
  let mockSubmissionsRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormsRepository = {
      findFirstWithVersions: vi.fn(),
    };
    mockSubmissionsRepository = {
      findMany: vi.fn(),
      count: vi.fn(),
    };
    vi.mocked(PrismaFormsRepository).mockImplementation(
      () => mockFormsRepository,
    );
    vi.mocked(PrismaFormSubmissionsRepository).mockImplementation(
      () => mockSubmissionsRepository,
    );
  });

  describe('Validações', () => {
    it('deve lançar erro quando formulário não existe', async () => {
      mockFormsRepository.findFirstWithVersions.mockResolvedValue(null);

      const formId = 'form-inexistente';
      const query = {
        page: 1,
        length_page: 20,
      };

      await expect(listFormSubmissionsService(formId, query)).rejects.toThrow(
        'The form form-inexistente does not exist or is inactive.',
      );
    });

    it('deve lançar erro quando length_page é inválido', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário de Teste',
        isActive: true,
        versions: [{ id: 'version-1' }],
      };

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);

      const formId = 'form-123';
      const query = {
        page: 1,
        length_page: 101, // length_page deve ser <= 100
      };

      await expect(listFormSubmissionsService(formId, query)).rejects.toThrow(
        'The parameter "length_page" must be less than or equal to 100.',
      );
    });
  });

  describe('Listagem de submissões', () => {
    it('deve listar submissões com dados válidos', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário de Teste',
        isActive: true,
        versions: [{ id: 'version-1' }],
      };

      const mockSubmissions = [
        {
          id: 'submission-1',
          formId: 'form-123',
          userId: 'user-123',
          data: {
            name: 'João Silva',
            age: 30,
          },
          calculated: {
            total: 100,
          },
          createdAt: new Date('2024-01-15T10:30:00.000Z'),
          schema_version: 1,
          form: {
            versions: [
              {
                id: 'version-1',
                schema_version: '1',
                fields: [
                  { id: 'name', type: 'text' },
                  { id: 'age', type: 'number' },
                  { id: 'total', type: 'calculated' },
                ],
              },
            ],
          },
        },
        {
          id: 'submission-2',
          formId: 'form-123',
          userId: 'user-456',
          data: {
            name: 'Maria Santos',
            age: 25,
          },
          calculated: {
            total: 150,
          },
          createdAt: new Date('2024-01-16T14:20:00.000Z'),
          schema_version: 1,
          form: {
            versions: [
              {
                id: 'version-1',
                schema_version: '1',
                fields: [
                  { id: 'name', type: 'text' },
                  { id: 'age', type: 'number' },
                  { id: 'total', type: 'calculated' },
                ],
              },
            ],
          },
        },
      ];

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.count.mockResolvedValue(2);
      mockSubmissionsRepository.findMany.mockResolvedValue(mockSubmissions);

      const formId = 'form-123';
      const query = {
        page: 1,
        length_page: 20,
      };

      const result = await listFormSubmissionsService(formId, query);

      expect(result).toEqual({
        page: 1,
        length_page: 20,
        total: 2,
        results: [
          {
            id_submit: 'submission-1',
            created_at: '2024-01-15T10:30:00.000Z',
            schema_version: 1,
            answers: {
              name: 'João Silva',
              age: 30,
            },
          },
          {
            id_submit: 'submission-2',
            created_at: '2024-01-16T14:20:00.000Z',
            schema_version: 1,
            answers: {
              name: 'Maria Santos',
              age: 25,
            },
          },
        ],
      });
    });

    it('deve retornar lista vazia quando não há submissões', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário sem Submissões',
        isActive: true,
        versions: [{ id: 'version-1' }],
      };

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.count.mockResolvedValue(0);
      mockSubmissionsRepository.findMany.mockResolvedValue([]);

      const formId = 'form-123';
      const query = {
        page: 1,
        length_page: 20,
      };

      const result = await listFormSubmissionsService(formId, query);

      expect(result).toEqual({
        page: 1,
        length_page: 20,
        total: 0,
        results: [],
      });
    });

    it('deve calcular paginação corretamente', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário com Muitas Submissões',
        isActive: true,
        versions: [{ id: 'version-1' }],
      };

      const mockSubmissions = Array.from({ length: 20 }, (_, i) => ({
        id: `submission-${i + 21}`, // página 2
        formId: 'form-123',
        userId: `user-${i + 21}`,
        data: {
          name: `User ${i + 21}`,
          age: 20 + i,
        },
        calculated: {},
        createdAt: new Date(`2024-01-${String((i % 28) + 1).padStart(2, '0')}:00:00.000Z`),
        schema_version: 1,
        form: {
          versions: [
            {
              id: 'version-1',
              schema_version: '1',
              fields: [
                { id: 'name', type: 'text' },
                { id: 'age', type: 'number' },
              ],
            },
          ],
        },
      }));

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.count.mockResolvedValue(50);
      mockSubmissionsRepository.findMany.mockResolvedValue(mockSubmissions);

      const formId = 'form-123';
      const query = {
        page: 2,
        length_page: 20,
      };

      const result = await listFormSubmissionsService(formId, query);

      expect(result.page).toBe(2);
      expect(result.length_page).toBe(20);
      expect(result.total).toBe(50);
      expect(result.results).toHaveLength(20);
    });
  });

  describe('Filtros', () => {
    it('deve aplicar filtros de schema_version corretamente', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário com Filtros',
        isActive: true,
        versions: [{ id: 'version-1' }],
      };

      const mockSubmissions = [
        {
          id: 'submission-1',
          formId: 'form-123',
          userId: 'user-123',
          data: { name: 'João' },
          calculated: {},
          createdAt: new Date('2024-01-15T10:30:00.000Z'),
          schema_version: 1,
          form: {
            versions: [
              {
                id: 'version-1',
                schema_version: '1',
                fields: [{ id: 'name', type: 'text' }],
              },
            ],
          },
        },
      ];

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.count.mockResolvedValue(1);
      mockSubmissionsRepository.findMany.mockResolvedValue(mockSubmissions);

      const formId = 'form-123';
      const query = {
        page: 1,
        length_page: 20,
        schema_version: 1,
      };

      const result = await listFormSubmissionsService(formId, query);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].schema_version).toBe(1);
    });
  });

  describe('Campos calculados', () => {
    it('deve incluir campos calculados nas submissões', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário com Campos Calculados',
        isActive: true,
        versions: [{ id: 'version-1' }],
      };

      const mockSubmissions = [
        {
          id: 'submission-1',
          formId: 'form-123',
          userId: 'user-123',
          data: {
            price: 10,
            quantity: 5,
            total: 50,
            tax: 5,
          },
          calculated: {
            total: 50,
            tax: 5,
          },
          createdAt: new Date('2024-01-15T10:30:00.000Z'),
          schema_version: 1,
          form: {
            versions: [
              {
                id: 'version-1',
                schema_version: '1',
                fields: [
                  { id: 'price', type: 'number' },
                  { id: 'quantity', type: 'number' },
                  { id: 'total', type: 'calculated' },
                  { id: 'tax', type: 'calculated' },
                ],
              },
            ],
          },
        },
      ];

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.count.mockResolvedValue(1);
      mockSubmissionsRepository.findMany.mockResolvedValue(mockSubmissions);

      const formId = 'form-123';
      const query = {
        page: 1,
        length_page: 20,
        include_calculated: true,
      };

      const result = await listFormSubmissionsService(formId, query);

      expect(result.results[0].calculated).toEqual({
        total: 50,
        tax: 5,
      });
    });

    it('deve lidar com submissões sem campos calculados', async () => {
      const mockForm = {
        id: 'form-123',
        name: 'Formulário Simples',
        isActive: true,
        versions: [{ id: 'version-1' }],
      };

      const mockSubmissions = [
        {
          id: 'submission-1',
          formId: 'form-123',
          userId: 'user-123',
          data: {
            name: 'João Silva',
            email: 'joao@example.com',
          },
          calculated: null,
          createdAt: new Date('2024-01-15T10:30:00.000Z'),
          schema_version: 1,
          form: {
            versions: [
              {
                id: 'version-1',
                schema_version: '1',
                fields: [
                  { id: 'name', type: 'text' },
                  { id: 'email', type: 'text' },
                ],
              },
            ],
          },
        },
      ];

      mockFormsRepository.findFirstWithVersions.mockResolvedValue(mockForm);
      mockSubmissionsRepository.count.mockResolvedValue(1);
      mockSubmissionsRepository.findMany.mockResolvedValue(mockSubmissions);

      const formId = 'form-123';
      const query = {
        page: 1,
        length_page: 20,
      };

      const result = await listFormSubmissionsService(formId, query);

      expect(result.results[0].calculated).toBeUndefined();
    });
  });
});
