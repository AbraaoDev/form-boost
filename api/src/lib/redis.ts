import Redis from 'ioredis';
import { env } from '@/env';

class RedisClient {
  private client: Redis;
  private isConnected = false;

  constructor() {
    this.client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('connect', () => {
      console.log('Redis connected');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      console.error('Error connecting to Redis:', error);
      this.isConnected = false;
    });

    this.client.on('disconnect', () => {
      console.log('Redis disconnected');
      this.isConnected = false;
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) return null;
      
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error fetching from cache:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      if (!this.isConnected) return;
      
      const serializedValue = JSON.stringify(value);
      const finalTtl = ttl || env.REDIS_TTL;
      
      await this.client.setex(key, finalTtl, serializedValue);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      if (!this.isConnected) return;
      
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error('Error deleting pattern from cache:', error);
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      if (!this.isConnected) return;
      await this.client.expire(key, seconds); 
    } catch (error) {
      console.error('Error setting TTL:', error);
    }
  }

  async invalidateFormsCache(): Promise<void> {
    await this.delPattern('forms:*');
    console.log('Forms cache cleared');
  }

}

export const redis = new RedisClient(); 