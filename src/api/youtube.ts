import axios from "axios";
import config from "../config";
import { SearchParams, SearchResponse, SearchResultItem } from "../types";

// YouTube API基础URL
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

/**
 * YouTube搜索API实现
 */
export async function searchYoutube(
  params: SearchParams,
): Promise<SearchResponse> {
  try {
    const { q, pageToken, maxResults = config.pagination.defaultSize } = params;

    // 构造YouTube API请求
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        part: "snippet",
        q,
        maxResults: Math.min(maxResults, config.pagination.maxSize),
        pageToken,
        type: "video",
        key: config.youtubeApiKey,
      },
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
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: "contentDetails,statistics",
        id: videoIds.join(","),
        key: config.youtubeApiKey,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("Get video details error:", error);
    return [];
  }
}
