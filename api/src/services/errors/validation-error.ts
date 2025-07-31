export class ValidationError extends Error {
  public readonly field: string;
  public readonly type: 'schema' | 'business' | 'dependency';
  public readonly code: string;

  constructor(
    field: string,
    message: string,
    type: 'schema' | 'business' | 'dependency' = 'business',
    code: string = 'VALIDATION_ERROR',
  ) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.type = type;
    this.code = code;
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
      error: this.code,
      field: this.field,
      message: this.message,
      type: this.type,
    };
  }
} 