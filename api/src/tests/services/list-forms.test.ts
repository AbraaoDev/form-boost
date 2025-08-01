import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import {
  InvalidFilterError,
  InvalidParamError,
  listFormsService,
} from '@/services/list-forms';

vi.mock('@/repositories/prisma-forms-repository');

describe('ListFormsService', () => {
  let mockRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = {
      listActive: vi.fn(),
      listAll: vi.fn(),
    };
    vi.mocked(PrismaFormsRepository).mockImplementation(() => mockRepository);
  });

  describe('Validações', () => {
    it('deve lançar erro quando length_page > 100', async () => {
      const query = {
        page: 1,
        length_page: 101,
        include_inactives: false,
      };

      await expect(listFormsService(query)).rejects.toThrow(InvalidParamError);
      await expect(listFormsService(query)).rejects.toThrow(
        'The parameter "length_page" must be less than or equal to 100.',
      );
    });

    it('deve lançar erro quando orderBy é inválido', async () => {
      const query = {
        page: 1,
        length_page: 20,
        orderBy: 'invalid' as any,
        include_inactives: false,
      };

      await expect(listFormsService(query)).rejects.toThrow(InvalidFilterError);
      await expect(listFormsService(query)).rejects.toThrow(
        "The parameter 'orderBy' must be one of 'name' or 'createdAt'.",
      );
    });
  });

  describe('Listagem de formulários ativos', () => {
    it('deve listar apenas formulários ativos por padrão', async () => {
      const mockForms = [
        {
          id: 'form-1',
          name: 'Formulário Ativo',
          isActive: true,
          createdAt: new Date('2024-01-15T10:30:00Z'),
          versions: [{ schema_version: '1' }],
        },
      ];

      mockRepository.listActive.mockResolvedValue({
        total: 1,
        forms: mockForms,
      });

      const query = {
        page: 1,
        length_page: 20,
        include_inactives: false,
      };

      const result = await listFormsService(query);

      expect(mockRepository.listActive).toHaveBeenCalledWith({
        name: undefined,
        schema_version: undefined,
        skip: 0,
        take: 20,
        orderBy: 'createdAt',
        order: 'asc',
      });

      expect(result).toEqual({
        page_active: 1,
        total_pages: 1,
        total_itens: 1,
        forms: [
          {
            id: 'form-1',
            name: 'Formulário Ativo',
            schema_version: 1,
            createdAt: '2024-01-15T10:30:00.000Z',
          },
        ],
      });
    });
  });

  describe('Listagem com include_inactives', () => {
    it('deve incluir formulários inativos quando include_inactives=true', async () => {
      const mockForms = [
        {
          id: 'form-1',
          name: 'Formulário Ativo',
          isActive: true,
          createdAt: new Date('2024-01-15T10:30:00Z'),
          versions: [{ schema_version: '1' }],
        },
        {
          id: 'form-2',
          name: 'Formulário Inativo',
          isActive: false,
          deletedAt: new Date('2024-01-20T15:45:00Z'),
          userDeleted: 'user-123',
          createdAt: new Date('2024-01-15T10:30:00Z'),
          versions: [{ schema_version: '1' }],
        },
      ];

      mockRepository.listAll.mockResolvedValue({
        total: 2,
        forms: mockForms,
      });

      const query = {
        page: 1,
        length_page: 20,
        include_inactives: true,
      };

      const result = await listFormsService(query);

      expect(mockRepository.listAll).toHaveBeenCalledWith({
        name: undefined,
        schema_version: undefined,
        skip: 0,
        take: 20,
        orderBy: 'createdAt',
        order: 'asc',
      });

      expect(result.forms).toHaveLength(2);
      expect(result.forms[0]).toEqual({
        id: 'form-1',
        name: 'Formulário Ativo',
        schema_version: 1,
        createdAt: '2024-01-15T10:30:00.000Z',
        isActive: true,
      });
      expect(result.forms[1]).toEqual({
        id: 'form-2',
        name: 'Formulário Inativo',
        schema_version: 1,
        createdAt: '2024-01-15T10:30:00.000Z',
        isActive: false,
        deletedAt: '2024-01-20T15:45:00.000Z',
        userDeleted: 'user-123',
      });
    });

    it('não deve incluir deletedAt e userDeleted para formulários ativos', async () => {
      const mockForms = [
        {
          id: 'form-1',
          name: 'Formulário Ativo',
          isActive: true,
          createdAt: new Date('2024-01-15T10:30:00Z'),
          versions: [{ schema_version: '1' }],
        },
      ];

      mockRepository.listAll.mockResolvedValue({
        total: 1,
        forms: mockForms,
      });

      const query = {
        page: 1,
        length_page: 20,
        include_inactives: true,
      };

      const result = await listFormsService(query);

      expect(result.forms[0]).not.toHaveProperty('deletedAt');
      expect(result.forms[0]).not.toHaveProperty('userDeleted');
    });
  });

  describe('Paginação', () => {
    it('deve calcular paginação corretamente', async () => {
      mockRepository.listActive.mockResolvedValue({
        total: 50,
        forms: [],
      });

      const query = {
        page: 3,
        length_page: 10,
        include_inactives: false,
      };

      const result = await listFormsService(query);

      expect(result.page_active).toBe(3);
      expect(result.total_pages).toBe(5);
      expect(result.total_itens).toBe(50);
    });
  });
});
