import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class PrismaFormSubmissionsRepository {
  async create(data: Prisma.FormSubmissionCreateInput) {
    return prisma.formSubmission.create({ data });
  }

  async findFirst(where: Prisma.FormSubmissionWhereInput, include?: Prisma.FormSubmissionInclude) {
    return prisma.formSubmission.findFirst({ where, include }) as Promise<any>;
  }

  async findMany(params: {
    where: Prisma.FormSubmissionWhereInput;
    skip: number;
    take: number;
    orderBy?: Prisma.FormSubmissionOrderByWithRelationInput;
    include?: Prisma.FormSubmissionInclude;
  }) {
    return prisma.formSubmission.findMany(params) as Promise<any[]>;
  }

  async count(where: Prisma.FormSubmissionWhereInput) {
    return prisma.formSubmission.count({ where });
  }

  async update(where: Prisma.FormSubmissionWhereUniqueInput, data: Prisma.FormSubmissionUpdateInput) {
    return prisma.formSubmission.update({ where, data });
  }
} 