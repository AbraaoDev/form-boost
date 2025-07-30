import type { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

type RequireJsonOptions = {
  accept?: boolean;
  contentType?: boolean;
};

export function requireJson(options: RequireJsonOptions) {
  return fastifyPlugin(async (app: FastifyInstance) => {
    app.addHook('preHandler', async (request, reply) => {
      if (options.accept) {
        const accept = request.headers.accept;
        if (!accept || !accept.includes('application/json')) {
          return reply.status(406).send({
            error: 'not_acceptable',
            mensagem: 'The header Accept must include application/json',
          });
        }
      }
      if (options.contentType) {
        const contentType = request.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
          return reply.status(415).send({
            error: 'unsupported_media_type',
            mensagem: 'The header Content-Type must be application/json',
          });
        }
      }
    });
  });
}
