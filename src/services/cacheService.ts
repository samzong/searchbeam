import { LRUCache } from "lru-cache";
import config from "../config";
import { SearchResponse } from "../types";

/**
 * Cache configuration
 */
const cacheOptions = {
  max: config.cache.maxItems,
  ttl: config.cache.ttl, // Cache expiration in milliseconds
};

/**
 * Search cache service implementation
 */
class CacheService {
  private cache: LRUCache<string, SearchResponse>;

  constructor() {
    this.cache = new LRUCache(cacheOptions);
  }

  /**
   * Generate cache key
   */
  private generateKey(
    platform: string,
    query: string,
    pageToken?: string,
  ): string {
    return `${platform}:${query}:${pageToken || "first"}`;
  }

  /**
   * Get cached content
   */
  get(
    platform: string,
    query: string,
    pageToken?: string,
  ): SearchResponse | undefined {
    const key = this.generateKey(platform, query, pageToken);
    return this.cache.get(key);
  }

  /**
   * Store content in cache
   */
  set(
    platform: string,
    query: string,
    data: SearchResponse,
    pageToken?: string,
  ): void {
    const key = this.generateKey(platform, query, pageToken);
    this.cache.set(key, data);
  }

  /**
   * Delete specific cache entry
   */
  delete(platform: string, query: string, pageToken?: string): void {
    const key = this.generateKey(platform, query, pageToken);
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export default new CacheService();
