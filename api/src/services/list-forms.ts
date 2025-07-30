import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import type { ListFormsQuery } from '@/schemas/list-forms-query';

class InvalidParamError extends Error {
  field: string;
  constructor(field: string, message: string) {
    super(message);
    this.field = field;
  }
}
class InvalidFilterError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function listFormsService(query: ListFormsQuery) {
  if (query.length_page && query.length_page > 100) {
    throw new InvalidParamError(
      'length_page',
      'The parameter "length_page" must be less than or equal to 100.',
    );
  }
  if (query.orderBy && !['name', 'createdAt'].includes(query.orderBy)) {
    throw new InvalidFilterError(
      "The parameter 'orderBy' must be one of 'name' or 'createdAt'.",
    );
  }

  const repoForm = new PrismaFormsRepository();

  const skip = (query.page - 1) * query.length_page;
  const take = query.length_page;

  const orderBy =
    query.orderBy === 'createdAt'
      ? 'createdAt'
      : query.orderBy === 'name'
        ? 'name'
        : 'createdAt';

  const order = query.order === 'desc' ? 'desc' : 'asc';

  const { total, forms } = await repoForm.listActive({
    name: query.name,
    schema_version: query.schema_version,
    skip,
    take,
    orderBy,
    order,
  });

  const total_pages = Math.ceil(total / take);

  return {
    page_active: query.page,
    total_pages,
    total_itens: total,
    forms: forms.map((form) => ({
      id: form.id,
      name: form.name,
      schema_version: form.versions[0]?.schema_version
        ? Number(form.versions[0].schema_version)
        : null,
      createdAt: form.createdAt.toISOString(),
    })),
  };
}

export { InvalidParamError, InvalidFilterError };
