import { prisma } from '@/lib/prisma';

export class FormNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'FormNotFoundError';
  }
}

export class SubmitNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'SubmitNotFoundError';
  }
}

export class SubmitAlreadyRemovedError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'SubmitAlreadyRemovedError';
  }
}

export class InactiveFormError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'InactiveFormError';
  }
}

export class SubmitBlockedError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'SubmitBlockedError';
  }
}

export class SoftDeleteFailError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'SoftDeleteFailError';
  }
}


export async function deleteFormSubmissionService(
  formId: string,
  submitId: string,
  userId: string
) {
  const form = await prisma.form.findFirst({
    where: {
      id: formId,
      isActive: true,
      deletedAt: null,
    },
  });

  if (!form) {
    throw new FormNotFoundError(`The form '${formId}' does not exist or is inactive.`);
  }

  const submission = await prisma.formSubmission.findFirst({
    where: {
      id: submitId,
      formId: formId,
    },
    include: {
      form: true,
    },
  });

  if (!submission) {
    throw new SubmitNotFoundError(`The submit '${submitId}' was not found for the form '${formId}'.`);
  }

  if (!submission.isActive) {
    throw new SubmitAlreadyRemovedError('The submit is already inactive. No further action has been taken.');
  }

  if (!submission.form.isActive) {
    throw new InactiveFormError('This form has been disabled and does not allow changes to your answers.');
  }

  const isProtected = false; 
  if (isProtected) {
    throw new SubmitBlockedError('The response is protected and cannot be removed due to retention policies.');
  }

  try {
    const now = new Date();
    
    const updatedSubmission = await prisma.formSubmission.update({
      where: {
        id: submitId,
      },
      data: {
        isActive: false,
        deletedAt: now,
        userDeleted: userId,
        updatedAt: now,
      },
    });


    return {
      message: `Submit '${submitId}' marked as inactive successfully.`,
      status: 'soft_deleted',
    };

  } catch (error) {
    console.error('Error during soft delete:', error);
    throw new SoftDeleteFailError(`Failed to soft delete submit '${submitId}'.`);
  }
} 