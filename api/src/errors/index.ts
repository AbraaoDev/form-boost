// Base Error

export { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error';
// Auth Errors (mantendo os existentes)
export { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';
export { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';
export { BaseError } from './base-error';
// Form Errors
export {
  CircularDependencyError,
  FormAlreadyDeletedError,
  FormNotFoundError,
  FormProtectedError,
  InvalidSchemaError,
  InvalidSchemaVersionError,
} from './form-errors';
// Submission Errors
export {
  InactiveFormError,
  SoftDeleteFailError,
  SubmitAlreadyRemovedError,
  SubmitBlockedError,
  SubmitNotFoundError,
} from './submission-errors';
// Validation Errors
export {
  InvalidFilterError,
  InvalidIdError,
  InvalidPageError,
  InvalidParamError,
} from './validation-errors';
