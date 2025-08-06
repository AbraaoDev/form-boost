import 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>;
    requireAuth(reply: FastifyReply): Promise<string>;
  }
}
