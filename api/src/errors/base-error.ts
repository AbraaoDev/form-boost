export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly field?: string;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    field?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.field = field;
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      ...(this.field && { field: this.field }),
    };
  }
} 