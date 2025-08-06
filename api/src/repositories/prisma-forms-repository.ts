import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CacheFormsService } from '@/services/cache-forms-service';

export class PrismaFormsRepository {
  private cacheService = new CacheFormsService();

  async createForm(data: Prisma.FormCreateInput) {
    const form = await prisma.form.create({ data });
    await this.cacheService.invalidateCache('form_created', form.id);
    return form;
  }

  async listActive({
    name,
    schema_version,
    skip,
    take,
    orderBy,
    order,
  }: {
    name?: string;
    schema_version?: number;
    skip: number;
    take: number;
    orderBy: 'name' | 'createdAt';
    order: 'asc' | 'desc';
  }) {
    const where: any = { isActive: true, deletedAt: null };
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const versionWhere: any = {};
    if (schema_version) {
      versionWhere.schema_version = String(schema_version);
    }

    const [total, forms] = await Promise.all([
      prisma.form.count({ where }),
      prisma.form.findMany({
        where,
        orderBy: { [orderBy]: order },
        skip,
        take,
        include: {
          versions: {
            where: versionWhere,
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
    ]);

    return { total, forms };
  }

  async listAll({
    name,
    schema_version,
    skip,
    take,
    orderBy,
    order,
  }: {
    name?: string;
    schema_version?: number;
    skip: number;
    take: number;
    orderBy: 'name' | 'createdAt';
    order: 'asc' | 'desc';
  }) {
    const where: any = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const versionWhere: any = {};
    if (schema_version) {
      versionWhere.schema_version = String(schema_version);
    }

    const [total, forms] = await Promise.all([
      prisma.form.count({ where }),
      prisma.form.findMany({
        where,
        orderBy: { [orderBy]: order },
        skip,
        take,
        include: {
          versions: {
            where: versionWhere,
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
    ]);

    return { total, forms };
  }

  async findActiveById(id: string) {
    return prisma.form.findFirst({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async softDeleteById(id: string, userId: string) {
    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) return null;
    if (form.protected) return 'protected';
    if (form.isActive === false) return 'already_deleted';

    const now = new Date();

    try {
      await prisma.form.update({
        where: { id },
        data: {
          isActive: false,
          deletedAt: now,
          userDeleted: userId,
        },
      });

      await this.cacheService.invalidateCache('form_deleted', id);
      return { now };
    } catch {
      return 'fail';
    }
  }

  async findFirstWithVersions(
    where: Prisma.FormWhereInput,
    include?: Prisma.FormInclude,
  ) {
    return prisma.form.findFirst({ where, include }) as Promise<any>;
  }

  async updateForm(
    where: Prisma.FormWhereUniqueInput,
    data: Prisma.FormUpdateInput,
    include?: Prisma.FormInclude,
  ) {
    const form = await prisma.form.update({ where, data, include });
    if (form.id) {
      await this.cacheService.invalidateCache('form_updated', form.id);
    }
    return form;
  }
}
