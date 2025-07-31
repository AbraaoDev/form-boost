import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import { PrismaFormSubmissionsRepository } from '@/repositories/prisma-form-submissions-repository';
import type { ListFormSubmissionsQuery } from '@/schemas/list-form-submissions';

export class FormNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'FormNotFoundError';
  }
}

export class InvalidParamError extends Error {
  field: string;
  constructor(field: string, message: string) {
    super(message);
    this.field = field;
  }
}

export class InvalidPageError extends Error {
  constructor(page: number) {
    super(`Page ${page} contains no results.`);
    this.name = 'InvalidPageError';
  }
}

interface FieldFilter {
  field: string;
  value: any;
}

export async function listFormSubmissionsService(
  formId: string,
  query: ListFormSubmissionsQuery,
  fieldFilters: FieldFilter[] = []
) {

  const prismaFormsRepository = new PrismaFormsRepository();
  
  const form = await prismaFormsRepository.findFirstWithVersions(
    {
      id: formId,
      isActive: true,
      deletedAt: null,
    },
    {
      versions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    }
  );

  if (!form) {
    throw new FormNotFoundError(`The form ${formId} does not exist or is inactive.`);
  }

  if (query.length_page > 100) {
    throw new InvalidParamError(
      'length_page',
      'The parameter "length_page" must be less than or equal to 100.',
    );
  }

  const whereConditions: any = {
    formId: formId,
  };

  if (query.schema_version) {
    whereConditions.schema_version = String(query.schema_version);
  }

  for (const filter of fieldFilters) {
    whereConditions.data = {
      ...whereConditions.data,
      [filter.field]: filter.value,
    };
  }

  const skip = (query.page - 1) * query.length_page;
  const take = query.length_page;

  const prismaFormSubmissionsRepository = new PrismaFormSubmissionsRepository();
  
  const total = await prismaFormSubmissionsRepository.count(whereConditions);

  const totalPages = Math.ceil(total / take);
  if (query.page > totalPages && total > 0) {
    throw new InvalidPageError(query.page);
  }

  const submissions = await prismaFormSubmissionsRepository.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      form: {
        include: {
          versions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  });


  const results = submissions.map(submission => {
    const data = submission.data as Record<string, any>;
    

    const answers: Record<string, any> = {};
    const calculated: Record<string, any> = {};

    const formFields = submission.form.versions[0]?.fields as any[] || [];
    const calculatedFieldIds = formFields
      .filter((field: any) => field.type === 'calculated')
      .map((field: any) => field.id);

    for (const [key, value] of Object.entries(data)) {
      if (calculatedFieldIds.includes(key)) {
        calculated[key] = value;
      } else {
        answers[key] = value;
      }
    }

    const result: any = {
      id_submit: submission.id,
      created_at: submission.createdAt.toISOString(),
      schema_version: Number(submission.form.versions[0]?.schema_version || 0),
      answers,
    };

    if (query.include_calculated && Object.keys(calculated).length > 0) {
      result.calculated = calculated;
    }

    return result;
  });

  return {
    page: query.page,
    length_page: query.length_page,
    total,
    results,
  };
}

export function extractFieldFilters(query: Record<string, any>): FieldFilter[] {
  const filters: FieldFilter[] = [];
  
  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith('field_')) {
      const fieldName = key.replace('field_', '');
      filters.push({
        field: fieldName,
        value,
      });
    }
  }
  
  return filters;
} 