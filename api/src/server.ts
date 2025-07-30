import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import chalk from 'chalk';

import { fastify } from 'fastify';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { env } from '@/env';
import { authenticate } from './http/routes/auth/authenticate';
import { register } from './http/routes/auth/register';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.register(fastifyCors);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FormBoost',
      description: 'Sistema de criação de formulários inteligentes.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: '/docs',
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(register);
app.register(authenticate);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    });
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    //TODO: Datadog external logging service
  }
  return reply.status(500).send({
    message: 'Internal server error',
    error: error.message,
  });
});

app.listen({ port: env.PORT }).then(() => {
  console.log(
    chalk.cyan(`🦊 Http server running http://${env.HOST}:${env.PORT}`),
  );
  console.log(
    chalk.magenta(
      `📂 Documentation API in http://${env.HOST}:${env.PORT}/docs`,
    ),
  );
});
