import { LRUCache } from 'lru-cache';
import config from '../src/config';
import { SearchResponse } from '../src/types';

// Mock LRUCache
jest.mock('lru-cache');
jest.mock('../src/config', () => ({
  cache: {
    maxItems: 1000,
    ttl: 600000, // 10 minutes
  },
}));

// Import CacheService after mocks
import CacheService from '../src/services/cacheService';

describe('CacheService', () => {
  let cacheService: typeof CacheService;
  let mockLRU: jest.Mocked<any>;
  
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Reset mock implementation
    mockLRU = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    } as unknown as jest.Mocked<any>;
    
    // Mock LRUCache constructor
    (LRUCache as unknown as jest.Mock).mockImplementation(() => mockLRU);
    
    // Recreate cacheService to use the mocked LRUCache
    // We need to re-require the module to get a fresh instance with our mocks
    jest.isolateModules(() => {
      const cacheServiceModule = require('../src/services/cacheService');
      cacheService = cacheServiceModule.default;
    });
  });
  
  it('should be initialized with correct configuration', () => {
    // Verify LRUCache was created with correct config
    expect(LRUCache).toHaveBeenCalledWith({
      max: config.cache.maxItems,
      ttl: config.cache.ttl,
    });
  });
  
  it('should generate cache keys correctly', () => {
    // Test get to check key format
    cacheService.get('youtube', 'test query');
    expect(mockLRU.get).toHaveBeenCalledWith('youtube:test query:first');
    
    // Test with pageToken
    cacheService.get('youtube', 'test query', 'next-token');
    expect(mockLRU.get).toHaveBeenCalledWith('youtube:test query:next-token');
  });
  
  it('should get cached items correctly', () => {
    // Create mock data
    const mockData: SearchResponse = {
      items: [{
        videoId: 'test-id',
        videoUrl: 'https://youtube.com/watch?v=test-id',
        title: 'Test Video',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        platform: 'youtube',
        publishedAt: '2023-01-01T00:00:00Z',
        channelTitle: 'Test Channel',
      }],
      nextPageToken: 'next-token',
      totalResults: 100,
    };
    
    // Setup mock LRU behavior
    mockLRU.get.mockImplementation((key: string) => {
      if (key === 'youtube:test query:first') {
        return mockData;
      }
      return undefined;
    });
    
    // Test successful cache hit
    const result = cacheService.get('youtube', 'test query');
    expect(result).toEqual(mockData);
    
    // Test cache miss
    const missResult = cacheService.get('youtube', 'missing query');
    expect(missResult).toBeUndefined();
  });
  
  it('should set cache items correctly', () => {
    // Create mock data
    const mockData: SearchResponse = {
      items: [{
        videoId: 'test-id',
        videoUrl: 'https://youtube.com/watch?v=test-id',
        title: 'Test Video',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        platform: 'youtube',
        publishedAt: '2023-01-01T00:00:00Z',
        channelTitle: 'Test Channel',
      }],
      nextPageToken: 'next-token',
      totalResults: 100,
    };
    
    // Set cache
    cacheService.set('youtube', 'test query', mockData);
    
    // Verify key generation and set was called
    expect(mockLRU.set).toHaveBeenCalledWith('youtube:test query:first', mockData);
    
    // Set with pageToken
    cacheService.set('youtube', 'test query', mockData, 'next-token');
    expect(mockLRU.set).toHaveBeenCalledWith('youtube:test query:next-token', mockData);
  });
  
  it('should delete cache items correctly', () => {
    // Delete from cache
    cacheService.delete('youtube', 'test query');
    
    // Verify key generation and delete was called
    expect(mockLRU.delete).toHaveBeenCalledWith('youtube:test query:first');
    
    // Delete with pageToken
    cacheService.delete('youtube', 'test query', 'next-token');
    expect(mockLRU.delete).toHaveBeenCalledWith('youtube:test query:next-token');
  });
  
  it('should clear all cache', () => {
    // Clear cache
    cacheService.clear();
    
    // Verify clear was called
    expect(mockLRU.clear).toHaveBeenCalled();
  });
}); 