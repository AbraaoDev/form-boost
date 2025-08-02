import { redis } from '@/lib/redis';
import type { ListFormsQuery } from '@/schemas/list-forms';

interface CacheConfig {
  ttl: number;
  maxItems: number;
  enableCache: boolean;
}

interface CacheKey {
  prefix: string;
  params: Record<string, any>;
}

export class CacheFormsService {
  private readonly CACHE_PREFIX = 'forms';
  private readonly DEFAULT_TTL = 300; // 5 minutos
  private readonly MAX_ITEMS = 1000;

  constructor(private config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: this.DEFAULT_TTL,
      maxItems: this.MAX_ITEMS,
      enableCache: true,
      ...config,
    };
  }

  private generateCacheKey(query: ListFormsQuery): string {
    const params = {
      page: query.page,
      length_page: query.length_page,
      orderBy: query.orderBy || 'createdAt',
      order: query.order || 'asc',
      name: query.name || '',
      schema_version: query.schema_version || '',
      include_inactives: query.include_inactives || false,
    };

    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key as keyof typeof params]}`)
      .join('|');

    return `${this.CACHE_PREFIX}:list:${this.hashString(sortedParams)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  //ttl for query conditions
  private getTTLForQuery(query: ListFormsQuery): number {
    const ttl = this.config.ttl || this.DEFAULT_TTL;
    
    if (query.name || query.schema_version) {
      return ttl / 2; 
    }

    if (!query.include_inactives) {
      return ttl * 2; 
    }

    return ttl;
  }

  //verify if the query should be cached
  private shouldCache(query: ListFormsQuery): boolean {
    if (!this.config.enableCache) return false;
    if (query.page > 10) return false;
    if (query.length_page > 50) return false;

    return true;
  }

  async getFromCache<T>(query: ListFormsQuery): Promise<T | null> {
    if (!this.shouldCache(query)) return null;

    try {
      const cacheKey = this.generateCacheKey(query);
      const cached = await redis.get<T>(cacheKey);

      if (cached) {
        console.log(`Cache hit: ${cacheKey}`);
        return cached;
      }

      console.log(`Cache miss: ${cacheKey}`);
      return null;
    } catch (error) {
      console.error('Error fetching from cache:', error);
      return null;
    }
  }

  async setCache<T>(query: ListFormsQuery, data: T): Promise<void> {
    if (!this.shouldCache(query)) return;

    try {
      const cacheKey = this.generateCacheKey(query);
      const ttl = this.getTTLForQuery(query);

      await redis.set(cacheKey, data, ttl);
      console.log(`Cache saved: ${cacheKey} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  async invalidateCache(event: 'form_created' | 'form_updated' | 'form_deleted', formId?: string): Promise<void> {
    try {
      switch (event) {
        case 'form_created':
          await redis.delPattern(`${this.CACHE_PREFIX}:list:*`);
          break;
        case 'form_updated':
          if (formId) {
            await redis.delPattern(`${this.CACHE_PREFIX}:*:${formId}:*`);
          }
          await redis.delPattern(`${this.CACHE_PREFIX}:list:*`);
          break;
        case 'form_deleted':
          await redis.invalidateFormsCache();
          break;
      }
      console.log(`Cache invalidated by event: ${event}${formId ? ` (formId: ${formId})` : ''}`);
    } catch (error) {
      console.error('Error invalidating cache:', error);
    }
  }

  // invalidate cache by count forms created
  async invalidateByCount(): Promise<void> {
    try {
      const formsCount = await redis.get<number>(`${this.CACHE_PREFIX}:forms_count`) || 0;
      if (formsCount > 10) {
        await redis.invalidateFormsCache();
        await redis.set(`${this.CACHE_PREFIX}:forms_count`, 0, 3600);
        console.log('Cache invalidated by count');
      }
    } catch (error) {
      console.error('Error invalidating cache by count:', error);
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      await redis.invalidateFormsCache();
      console.log('All forms cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
} 