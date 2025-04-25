import { LRUCache } from 'lru-cache';
import config from '../config';
import { SearchResponse } from '../types';

/**
 * 缓存配置
 */
const cacheOptions = {
  max: config.cache.maxItems,
  ttl: config.cache.ttl, // 缓存有效期，毫秒
};

/**
 * 搜索缓存服务实现
 */
class CacheService {
  private cache: LRUCache<string, SearchResponse>;

  constructor() {
    this.cache = new LRUCache(cacheOptions);
  }

  /**
   * 生成缓存键
   */
  private generateKey(platform: string, query: string, pageToken?: string): string {
    return `${platform}:${query}:${pageToken || 'first'}`;
  }

  /**
   * 获取缓存内容
   */
  get(platform: string, query: string, pageToken?: string): SearchResponse | undefined {
    const key = this.generateKey(platform, query, pageToken);
    return this.cache.get(key);
  }

  /**
   * 存储内容到缓存
   */
  set(platform: string, query: string, data: SearchResponse, pageToken?: string): void {
    const key = this.generateKey(platform, query, pageToken);
    this.cache.set(key, data);
  }

  /**
   * 删除指定缓存
   */
  delete(platform: string, query: string, pageToken?: string): void {
    const key = this.generateKey(platform, query, pageToken);
    this.cache.delete(key);
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
  }
}

// 导出单例
export default new CacheService(); 