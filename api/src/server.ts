import fastifyCookie from '@fastify/cookie';
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
import { errorHandler } from './http/middlewares/error-handler';
import { apiRoutes } from './http/routes';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.register(fastifyCors, {
  origin: ['http://localhost:3000', 'http://localhost:3333'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
app.register(fastifyCookie);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FormBoost',
      description: 'Sistema de criação de formulários inteligentes.',
      version: '1.0.0',
    },
    servers: [{ url: `http://${env.HOST}:${env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: '/docs',
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(apiRoutes, { prefix: `/api/${env.VERSION}` });

app.setErrorHandler(errorHandler);

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  const serverUrl = `http://${env.HOST}:${env.PORT}`;
  console.log(chalk.cyan(`🦊 Http server running on ${serverUrl}`));
  console.log(
    chalk.yellow(
      `🚀 API routes available under ${serverUrl}/api/${env.VERSION}`,
    ),
  );
  console.log(chalk.magenta(`📂 Documentation API in ${serverUrl}/docs`));
});
