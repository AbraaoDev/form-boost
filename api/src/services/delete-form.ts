import { PrismaFormsRepository } from '@/repositories/prisma-forms-repository';
import { FormNotFoundError, FormProtectedError, SoftDeleteFailError } from '@/errors';

export async function deleteFormService(id: string, userId: string) {
  const repo = new PrismaFormsRepository();
  const result = await repo.softDeleteById(id, userId);

  if (result === null)
    throw new FormNotFoundError(
      `The form with ID "${id}" was not found or has no versions.`,
    );
  if (result === 'protected')
    throw new FormProtectedError(
      `The form with ID "${id}" is protected and cannot be deleted.`,
    );
  if (result === 'fail')
    throw new SoftDeleteFailError(
      `Failed to soft delete form with ID "${id}".`,
    );

  return {
    message: `Form with ID "${id}" has been successfully deleted.`,
    status: 'soft_deleted',
  };
}
