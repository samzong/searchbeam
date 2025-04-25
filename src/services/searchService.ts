import { searchYoutube } from "../api/youtube";
import { SearchParams, SearchResponse, SupportedPlatform } from "../types";
import cacheService from "./cacheService";

/**
 * 搜索服务实现
 */
class SearchService {
  /**
   * 根据平台分发搜索请求
   * @param params 搜索参数
   * @returns Promise<SearchResponse> 搜索结果
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const { platform, q, pageToken, maxResults } = params;

    // 验证平台类型
    if (!this.isValidPlatform(platform)) {
      return {
        items: [],
        error: `Unsupported platform: ${platform}. Currently supported: youtube`,
      };
    }

    // 检查缓存
    const cached = cacheService.get(platform, q, pageToken);
    if (cached) {
      return cached;
    }

    // 根据平台分发请求
    let result: SearchResponse;

    try {
      if (platform === "youtube") {
        result = await searchYoutube(params);
      } else {
        // 为未来其他平台预留，目前已在上面验证
        result = {
          items: [],
          error: "Platform not available",
        };
      }

      // 缓存结果
      if (result.items.length > 0 && !result.error) {
        cacheService.set(platform, q, result, pageToken);
      }

      return result;
    } catch (error) {
      console.error(`Search error (${platform}):`, error);
      return {
        items: [],
        error: "Search processing failed",
      };
    }
  }

  /**
   * 验证平台是否支持
   * @param platform 平台名称
   * @returns boolean 是否支持
   */
  private isValidPlatform(platform: string): platform is SupportedPlatform {
    return platform === "youtube"; // Currently only supports YouTube
  }
}

// 导出单例
export default new SearchService();
