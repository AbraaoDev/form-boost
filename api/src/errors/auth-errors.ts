import { BaseError } from './base-error';

export class UnauthorizedError extends BaseError {
  constructor(message?: string) {
    super(message ?? 'Unauthorized', '401');
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super('Invalid credentials.', '401');
  }
}

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super('E-mail already exists.', '409');
  }
} 