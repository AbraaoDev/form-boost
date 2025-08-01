import { BaseError } from './base-error';

export class FormNotFoundError extends BaseError {
  constructor(message: string = 'Form not found') {
    super(message, 'FORM_NOT_FOUND', 404);
  }
}

export class FormProtectedError extends BaseError {
  constructor(message: string = 'Form is protected and cannot be modified') {
    super(message, 'FORM_PROTECTED', 403);
  }
}

export class FormAlreadyDeletedError extends BaseError {
  constructor(message: string = 'Form is already deleted') {
    super(message, 'FORM_ALREADY_DELETED', 409);
  }
}

export class InvalidSchemaVersionError extends BaseError {
  constructor(version: number) {
    super(
      `The schema version ${version} is lower or equal to the current version of the form.`,
      'INVALID_SCHEMA_VERSION',
      422,
    );
  }
}

export class InvalidSchemaError extends BaseError {
  public readonly errors: Array<{ field: string; message: string }>;

  constructor(errors: Array<{ field: string; message: string }>) {
    super('There are errors in the new schema.', 'INVALID_SCHEMA', 422);
    this.errors = errors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

export class CircularDependencyError extends BaseError {
  constructor(message: string) {
    super(message, 'CIRCULAR_DEPENDENCY_ERROR', 422);
  }
} 