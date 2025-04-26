/**
 * Unified video search result item definition
 */
export interface SearchResultItem {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  platform: string;
  publishedAt?: string;
  channelTitle?: string;
  viewCount?: string;
  [extraFields: string]: any; // Platform-specific additional data
}

/**
 * Search response structure
 */
export interface SearchResponse {
  items: SearchResultItem[];
  nextPageToken?: string;
  totalResults?: number;
  error?: string;
}

/**
 * Search request parameters
 */
export interface SearchParams {
  platform: string;
  q: string;
  pageToken?: string;
  maxResults?: number;
}

/**
 * API error response
 */
export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

/**
 * Supported search platform types
 */
export type SupportedPlatform = "youtube" | "bilibili";
