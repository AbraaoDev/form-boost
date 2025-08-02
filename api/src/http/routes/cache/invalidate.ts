import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { CacheFormsService } from '@/services/cache-forms-service';

const cacheService = new CacheFormsService();

export async function cacheInvalidateRoute(app: FastifyInstance) {
  app.post('/cache/clear', {
    schema: {
      tags: ['Cache'],
      summary: 'Clear all cache',
      description: 'Remove all cache entries for forms',
      response: {
        200: z.object({
          message: z.string(),
          timestamp: z.string(),
        }),
      },
    },
  }, async () => {
    await cacheService.clearAllCache();
    
    return {
      message: 'Cleared cache',
      timestamp: new Date().toISOString(),
    };
  });

} 