import axios from "axios";
import config from "../config";
import ApiKeyManager from "../utils/apiKeyManager";
import { SearchParams, SearchResponse, SearchResultItem } from "../types";
import { createLogger } from "../utils/logger";

// Create API-specific logger
const apiLogger = createLogger("YouTubeAPI");

// YouTube API base URL
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

// Create API key manager instance
const apiKeyManager = new ApiKeyManager(config.youtubeApiKeys);

// Maximum retry attempts
const MAX_RETRY_ATTEMPTS = 3;

/**
 * YouTube search API implementation
 */
export async function searchYoutube(
  params: SearchParams,
): Promise<SearchResponse> {
  let retryCount = 0;
  
  // Use loop instead of recursion
  while (retryCount <= MAX_RETRY_ATTEMPTS) {
    try {
      const { q, pageToken, maxResults = config.pagination.defaultSize } = params;
      
      // Check if any API keys are available
      if (apiKeyManager.getAvailableKeyCount() === 0) {
        apiLogger.error("All API keys have reached quota limits");
        return {
          items: [],
          error: "All API keys have reached quota limits",
        };
      }
      
      // Get next available API key
      const apiKey = apiKeyManager.getNextKey();
      apiLogger.debug(`Using API key: ${apiKey.substring(0, 6)}... for search query: "${q}"`);

      // Construct YouTube API request parameters
      const requestParams: Record<string, any> = {
        part: "snippet",
        q,
        maxResults: Math.min(maxResults, config.pagination.maxSize),
        type: "video",
        key: apiKey,
      };

      // Only add pageToken to request parameters if it exists
      if (pageToken) {
        requestParams.pageToken = pageToken;
        apiLogger.debug(`Using page token: ${pageToken}`);
      }

      // Send request
      apiLogger.info(`Sending YouTube search request for: "${q}"`);
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: requestParams,
      });

      const { items, nextPageToken, pageInfo } = response.data;
      apiLogger.info(`Received ${items.length} results from YouTube API`);

      // Convert to unified response format
      const formattedItems: SearchResultItem[] = items.map((item: any) => ({
        videoId: item.id.videoId,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        title: item.snippet.title,
        thumbnailUrl:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default.url,
        platform: "youtube",
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
      }));

      return {
        items: formattedItems,
        nextPageToken: nextPageToken || undefined,
        totalResults: pageInfo?.totalResults,
      };
    } catch (error: any) {
      apiLogger.error("YouTube search error:", error.response?.data || error.message);
      
      // Handle quota limit error, mark key
      if (
        error.response?.status === 403 && 
        error.response?.data?.error?.errors?.some((e: any) => e.reason === "quotaExceeded")
      ) {
        const limitedKey = error.config?.params?.key;
        if (limitedKey) {
          apiKeyManager.markKeyLimited(limitedKey);
          apiLogger.warn(`API key ${limitedKey.substring(0, 6)}... has reached quota limit, removed from available list`);
          
          // If there are still available keys, retry
          if (apiKeyManager.getAvailableKeyCount() > 0) {
            retryCount++;
            apiLogger.info(`Attempting to retry request with another API key (${retryCount}/${MAX_RETRY_ATTEMPTS}), remaining available keys: ${apiKeyManager.getAvailableKeyCount()}`);
            continue; // Continue loop using a new API key
          }
        }
      }
      
      // Max retry attempts reached or other error
      return {
        items: [],
        error: error.response?.data?.error?.message || "Search request failed",
      };
    }
  }
  
  // If max retry attempts reached
  apiLogger.error(`Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) reached, search request failed`);
  return {
    items: [],
    error: `Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) reached, search request failed`,
  };
}
