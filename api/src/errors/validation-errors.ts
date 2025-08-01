import { BaseError } from './base-error';

export class InvalidIdError extends BaseError {
  constructor(message: string = 'The provided ID is invalid') {
    super(message, 'INVALID_ID', 422);
  }
}

export class InvalidParamError extends BaseError {
  constructor(field: string, message: string) {
    super(message, 'INVALID_PARAM', 422, field);
  }
}

export class InvalidFilterError extends BaseError {
  constructor(message: string) {
    super(message, 'INVALID_FILTER', 422);
  }
}

export class InvalidPageError extends BaseError {
  constructor(page: number) {
    super(`Page ${page} contains no results.`, 'INVALID_PAGE', 422);
  }
}

export class ValidationError extends BaseError {
  public readonly type: 'schema' | 'business' | 'dependency';

  constructor(
    field: string,
    message: string,
    type: 'schema' | 'business' | 'dependency' = 'business',
    code: string = 'VALIDATION_ERROR',
  ) {
    super(message, code, 422, field);
    this.type = type;
  }

  static fromFieldError(error: { field: string; message: string; type: string }): ValidationError {
    return new ValidationError(
      error.field,
      error.message,
      error.type as 'schema' | 'business' | 'dependency',
    );
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
    };
  }
} 