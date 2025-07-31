import type { FastifyInstance } from 'fastify';

import { authenticate } from './auth/authenticate';
import { register } from './auth/register';
import { createFormRoute } from './forms/create';
import { deleteFormRoute } from './forms/delete';
import { deleteFormSubmissionRoute } from './forms/delete-submission';
import { getFormByIdRoute } from './forms/get-by-id';
import { listFormsRoute } from './forms/list';
import { listFormSubmissionsRoute } from './forms/list-submissions';
import { submitFormRoute } from './forms/submit';
import { updateFormSchemaVersionRoute } from './forms/update';

export async function apiRoutes(app: FastifyInstance) {
  app.register(register);
  app.register(authenticate);
  app.register(createFormRoute);
  app.register(listFormsRoute);
  app.register(getFormByIdRoute);
  app.register(deleteFormRoute);
  app.register(submitFormRoute);
  app.register(listFormSubmissionsRoute);
  app.register(deleteFormSubmissionRoute);
  app.register(updateFormSchemaVersionRoute);
}
