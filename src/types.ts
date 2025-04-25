/**
 * 统一的视频搜索结果类型定义
 */
export interface SearchResultItem {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  platform: string;
  publishedAt?: string;
  channelTitle?: string;
  viewCount?: string;
  [extraFields: string]: any; // 平台特定附加数据
}

/**
 * 搜索响应结构
 */
export interface SearchResponse {
  items: SearchResultItem[];
  nextPageToken?: string;
  totalResults?: number;
  error?: string;
}

/**
 * 搜索请求参数
 */
export interface SearchParams {
  platform: string;
  q: string;
  pageToken?: string;
  maxResults?: number;
}

/**
 * API错误响应
 */
export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

/**
 * 支持的搜索平台类型
 */
export type SupportedPlatform = 'youtube' | 'bilibili'; 