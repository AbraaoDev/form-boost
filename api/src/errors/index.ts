// Base Error
export { BaseError } from './base-error';

// Form Errors
export {
  FormNotFoundError,
  FormProtectedError,
  FormAlreadyDeletedError,
  InvalidSchemaVersionError,
  InvalidSchemaError,
  CircularDependencyError,
} from './form-errors';

// Submission Errors
export {
  SubmitNotFoundError,
  SubmitAlreadyRemovedError,
  InactiveFormError,
  SubmitBlockedError,
  SoftDeleteFailError,
} from './submission-errors';

// Validation Errors
export {
  InvalidIdError,
  InvalidParamError,
  InvalidFilterError,
  InvalidPageError,
} from './validation-errors';

// Auth Errors (mantendo os existentes)
export { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';
export { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';
export { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'; 