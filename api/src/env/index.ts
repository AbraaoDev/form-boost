// import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string().default('default_secret'),
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(3333),
  VERSION: z.string().default('v1'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_TTL: z.coerce.number().default(300), 
  REDIS_MAX_ITEMS: z.coerce.number().default(1000), 
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format());
  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
