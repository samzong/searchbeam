import axios from "axios";
import config from "../config";
import ApiKeyManager from "../utils/apiKeyManager";
import { SearchParams, SearchResponse, SearchResultItem } from "../types";

// YouTube API基础URL
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

// 创建API密钥管理器实例
const apiKeyManager = new ApiKeyManager(config.youtubeApiKeys);

/**
 * YouTube搜索API实现
 */
export async function searchYoutube(
  params: SearchParams,
): Promise<SearchResponse> {
  try {
    const { q, pageToken, maxResults = config.pagination.defaultSize } = params;
    
    // 获取下一个可用API密钥
    const apiKey = apiKeyManager.getNextKey();

    // 构造YouTube API请求参数
    const requestParams: Record<string, any> = {
      part: "snippet",
      q,
      maxResults: Math.min(maxResults, config.pagination.maxSize),
      type: "video",
      key: apiKey,
    };

    // 只有当pageToken存在时才添加到请求参数
    if (pageToken) {
      requestParams.pageToken = pageToken;
    }

    // 发送请求
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: requestParams,
    });

    const { items, nextPageToken, pageInfo } = response.data;

    // 转换为统一响应格式
    const formattedItems: SearchResultItem[] = items.map((item: any) => ({
      videoId: item.id.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      thumbnailUrl:
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default.url,
      duration: "", // 需要额外API调用获取时长
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
    console.error("YouTube search error:", error.response?.data || error.message);
    
    // 处理配额限制错误，标记密钥
    if (error.response?.status === 403 && 
        error.response?.data?.error?.errors?.some((e: any) => e.reason === "quotaExceeded")) {
      const limitedKey = error.config?.params?.key;
      if (limitedKey) {
        apiKeyManager.markKeyLimited(limitedKey);
        console.log(`API密钥 ${limitedKey.substring(0, 6)}... 已达到配额限制，已从可用列表中移除`);
        
        // 如果还有可用密钥，重试请求
        if (apiKeyManager.getAvailableKeyCount() > 0) {
          console.log(`尝试使用其他API密钥重试请求，剩余可用密钥: ${apiKeyManager.getAvailableKeyCount()}`);
          return searchYoutube(params);
        }
      }
    }
    
    return {
      items: [],
      error: error.response?.data?.error?.message || "Search request failed",
    };
  }
}

/**
 * 获取视频详细信息，包括时长
 * 注意：这是一个增强功能，可以按需实现，通过额外API调用获取视频详情如时长
 */
export async function getVideoDetails(videoIds: string[]): Promise<any> {
  try {
    // 获取下一个可用API密钥
    const apiKey = apiKeyManager.getNextKey();
    
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: "contentDetails,statistics",
        id: videoIds.join(","),
        key: apiKey,
      },
    });

    return response.data.items;
  } catch (error: any) {
    console.error("Get video details error:", error);
    
    // 处理配额限制错误
    if (error.response?.status === 403 && 
        error.response?.data?.error?.errors?.some((e: any) => e.reason === "quotaExceeded")) {
      const limitedKey = error.config?.params?.key;
      if (limitedKey) {
        apiKeyManager.markKeyLimited(limitedKey);
        console.log(`API密钥 ${limitedKey.substring(0, 6)}... 已达到配额限制，已从可用列表中移除`);
        
        // 如果还有可用密钥，重试请求
        if (apiKeyManager.getAvailableKeyCount() > 0) {
          console.log(`尝试使用其他API密钥重试请求，剩余可用密钥: ${apiKeyManager.getAvailableKeyCount()}`);
          return getVideoDetails(videoIds);
        }
      }
    }
    
    return [];
  }
}
