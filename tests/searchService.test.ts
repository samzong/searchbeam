import searchService from '../src/services/searchService';
import cacheService from '../src/services/cacheService';
import * as youtubeApi from '../src/api/youtube';

// 模拟依赖
jest.mock('../src/api/youtube');
jest.mock('../src/services/cacheService');

describe('SearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该返回YouTube搜索结果', async () => {
    // 模拟YouTube API响应
    const mockYoutubeResponse = {
      items: [
        {
          videoId: 'test-id',
          title: 'Test Video',
          videoUrl: 'https://youtube.com/watch?v=test-id',
          thumbnailUrl: 'https://example.com/thumbnail.jpg',
          duration: '10:00',
          platform: 'youtube',
        },
      ],
      nextPageToken: 'next-token',
      totalResults: 100,
    };

    // 设置Mock返回值
    (youtubeApi.searchYoutube as jest.Mock).mockResolvedValue(mockYoutubeResponse);
    (cacheService.get as jest.Mock).mockReturnValue(null); // 缓存未命中

    // 执行测试
    const result = await searchService.search({
      platform: 'youtube',
      q: 'test query',
    });

    // 验证结果
    expect(result).toEqual(mockYoutubeResponse);
    expect(youtubeApi.searchYoutube).toHaveBeenCalledWith({
      platform: 'youtube',
      q: 'test query',
    });
    expect(cacheService.set).toHaveBeenCalledWith(
      'youtube',
      'test query',
      mockYoutubeResponse,
      undefined
    );
  });

  it('应该返回缓存结果', async () => {
    // 模拟缓存响应
    const mockCachedResponse = {
      items: [
        {
          videoId: 'cached-id',
          title: 'Cached Video',
          videoUrl: 'https://youtube.com/watch?v=cached-id',
          thumbnailUrl: 'https://example.com/cached.jpg',
          duration: '5:00',
          platform: 'youtube',
        },
      ],
      nextPageToken: 'cached-token',
      totalResults: 50,
    };

    // 设置Mock返回值
    (cacheService.get as jest.Mock).mockReturnValue(mockCachedResponse); // 缓存命中

    // 执行测试
    const result = await searchService.search({
      platform: 'youtube',
      q: 'cached query',
    });

    // 验证结果
    expect(result).toEqual(mockCachedResponse);
    expect(youtubeApi.searchYoutube).not.toHaveBeenCalled(); // API不应被调用
    expect(cacheService.set).not.toHaveBeenCalled(); // 缓存不应被设置
  });

  it('应该处理不支持的平台', async () => {
    // 执行测试
    const result = await searchService.search({
      platform: 'unsupported' as any,
      q: 'test query',
    });

    // 验证结果
    expect(result.items).toEqual([]);
    expect(result.error).toContain('不支持的平台');
    expect(youtubeApi.searchYoutube).not.toHaveBeenCalled();
    expect(cacheService.set).not.toHaveBeenCalled();
  });

  it('应该处理搜索错误', async () => {
    // 设置Mock返回值
    (youtubeApi.searchYoutube as jest.Mock).mockRejectedValue(new Error('API错误'));
    (cacheService.get as jest.Mock).mockReturnValue(null);

    // 执行测试
    const result = await searchService.search({
      platform: 'youtube',
      q: 'error query',
    });

    // 验证结果
    expect(result.items).toEqual([]);
    expect(result.error).toBe('搜索处理失败');
    expect(cacheService.set).not.toHaveBeenCalled();
  });
}); 