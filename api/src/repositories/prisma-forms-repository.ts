import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class PrismaFormsRepository {
  async create(data: Prisma.FormCreateInput) {
    return prisma.form.create({ data });
  }
}
