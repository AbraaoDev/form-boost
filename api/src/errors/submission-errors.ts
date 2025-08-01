import { BaseError } from './base-error';

export class SubmitNotFoundError extends BaseError {
  constructor(message: string = 'Submission not found') {
    super(message, 'SUBMIT_NOT_FOUND', 404);
  }
}

export class SubmitAlreadyRemovedError extends BaseError {
  constructor(message: string = 'Submission is already inactive') {
    super(message, 'SUBMIT_ALREADY_REMOVED', 409);
  }
}

export class InactiveFormError extends BaseError {
  constructor(
    message: string = 'This form has been disabled and does not allow changes',
  ) {
    super(message, 'INACTIVE_FORM', 403);
  }
}

export class SubmitBlockedError extends BaseError {
  constructor(
    message: string = 'The response is protected and cannot be removed due to retention policies',
  ) {
    super(message, 'SUBMIT_BLOCKED', 403);
  }
}

export class SoftDeleteFailError extends BaseError {
  constructor(message: string = 'Failed to soft delete') {
    super(message, 'SOFT_DELETE_FAIL', 500);
  }
}
