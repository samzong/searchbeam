import { searchYoutube } from "../api/youtube";
import { SearchParams, SearchResponse, SupportedPlatform } from "../types";
import cacheService from "./cacheService";
import logger, { createLogger } from "../utils/logger";

// Create a service-specific logger
const serviceLogger = createLogger("SearchService");

/**
 * Search service implementation
 */
class SearchService {
  /**
   * Dispatches search requests based on platform
   * @param params Search parameters
   * @returns Promise<SearchResponse> Search results
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const { platform, q, pageToken, maxResults } = params;

    // Validate platform type
    if (!this.isValidPlatform(platform)) {
      serviceLogger.warn(`Unsupported platform requested: ${platform}`);
      return {
        items: [],
        error: `Unsupported platform: ${platform}. Currently supported: youtube`,
      };
    }

    serviceLogger.info(`Processing ${platform} search for query: "${q}"`);

    // Check cache
    const cached = cacheService.get(platform, q, pageToken);
    if (cached) {
      serviceLogger.debug(`Cache hit for query: "${q}" with pageToken: ${pageToken || "first page"}`);
      return cached;
    }

    // Dispatch request based on platform
    let result: SearchResponse;

    try {
      if (platform === "youtube") {
        serviceLogger.debug(`Dispatching YouTube search for query: "${q}"`);
        result = await searchYoutube(params);
      } else if (platform === "bilibili") {
        // TODO: Implement Bilibili search in future versions
        serviceLogger.warn(`Bilibili search requested but not implemented yet`);
        result = {
          items: [],
          error: "Bilibili search not implemented yet",
        };
      } else {
        // This should never happen due to type checking, but keeping for safety
        serviceLogger.error(`Unknown platform type passed validation: ${platform}`);
        result = {
          items: [],
          error: "Platform not available",
        };
      }

      // Cache results
      if (result.items.length > 0 && !result.error) {
        serviceLogger.debug(`Caching ${result.items.length} results for query: "${q}"`);
        cacheService.set(platform, q, result, pageToken);
      }

      return result;
    } catch (error) {
      serviceLogger.error(`Search error (${platform}):`, error);
      return {
        items: [],
        error: "Search processing failed",
      };
    }
  }

  /**
   * Validates if platform is supported
   * @param platform Platform name
   * @returns boolean Is platform supported
   */
  private isValidPlatform(platform: string): platform is SupportedPlatform {
    // Check platform against all values in SupportedPlatform type
    return ["youtube", "bilibili"].includes(platform as SupportedPlatform);
  }
}

// Export singleton
export default new SearchService();
