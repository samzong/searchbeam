import searchService from '../src/services/searchService';
import cacheService from '../src/services/cacheService';
import * as youtubeApi from '../src/api/youtube';

// Mock dependencies
jest.mock('../src/api/youtube');
jest.mock('../src/services/cacheService');

describe('SearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return YouTube search results', async () => {
    // Mock YouTube API response
    const mockYoutubeResponse = {
      items: [
        {
          videoId: 'test-id',
          title: 'Test Video',
          videoUrl: 'https://youtube.com/watch?v=test-id',
          thumbnailUrl: 'https://example.com/thumbnail.jpg',
          platform: 'youtube',
        },
      ],
      nextPageToken: 'next-token',
      totalResults: 100,
    };

    // Set mock return values
    (youtubeApi.searchYoutube as jest.Mock).mockResolvedValue(mockYoutubeResponse);
    (cacheService.get as jest.Mock).mockReturnValue(null); // Cache miss

    // Execute test
    const result = await searchService.search({
      platform: 'youtube',
      q: 'test query',
    });

    // Verify results
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

  it('should return cached results', async () => {
    // Mock cache response
    const mockCachedResponse = {
      items: [
        {
          videoId: 'cached-id',
          title: 'Cached Video',
          videoUrl: 'https://youtube.com/watch?v=cached-id',
          thumbnailUrl: 'https://example.com/cached.jpg',
          platform: 'youtube',
        },
      ],
      nextPageToken: 'cached-token',
      totalResults: 50,
    };

    // Set mock return values
    (cacheService.get as jest.Mock).mockReturnValue(mockCachedResponse); // Cache hit

    // Execute test
    const result = await searchService.search({
      platform: 'youtube',
      q: 'cached query',
    });

    // Verify results
    expect(result).toEqual(mockCachedResponse);
    expect(youtubeApi.searchYoutube).not.toHaveBeenCalled(); // API should not be called
    expect(cacheService.set).not.toHaveBeenCalled(); // Cache should not be set
  });

  it('should handle unsupported platforms', async () => {
    // Execute test
    const result = await searchService.search({
      platform: 'unsupported' as any,
      q: 'test query',
    });

    // Verify results
    expect(result.items).toEqual([]);
    expect(result.error).toContain('Unsupported platform');
    expect(youtubeApi.searchYoutube).not.toHaveBeenCalled();
    expect(cacheService.set).not.toHaveBeenCalled();
  });

  it('should handle search errors', async () => {
    // Set mock return values
    (youtubeApi.searchYoutube as jest.Mock).mockRejectedValue(new Error('API error'));
    (cacheService.get as jest.Mock).mockReturnValue(null);

    // Execute test
    const result = await searchService.search({
      platform: 'youtube',
      q: 'error query',
    });

    // Verify results
    expect(result.items).toEqual([]);
    expect(result.error).toBe('Search processing failed');
    expect(cacheService.set).not.toHaveBeenCalled();
  });
}); 