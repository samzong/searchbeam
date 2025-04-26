import dotenv from "dotenv";
import { join } from "path";
import logger from "./utils/logger";

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  youtubeApiKeys: string[];
  authTokens: string[];
  cache: {
    maxItems: number;
    ttl: number;
  };
  cors: {
    origin: string | string[];
  };
  pagination: {
    defaultSize: number;
    maxSize: number;
  };
}

// Get configuration from environment variables, provide default values
const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  youtubeApiKeys: (process.env.YOUTUBE_API_KEYS || "").split(",").filter(Boolean),
  authTokens: (process.env.AUTH_TOKENS || "").split(",").filter(Boolean),
  cache: {
    maxItems: parseInt(process.env.CACHE_MAX_ITEMS || "1000", 10),
    ttl: parseInt(process.env.CACHE_TTL || "600000", 10), // Default 10 minutes
  },
  cors: {
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*"
        : (process.env.CORS_ORIGIN || "").split(",").filter(Boolean),
  },
  pagination: {
    defaultSize: parseInt(process.env.DEFAULT_PAGE_SIZE || "10", 10),
    maxSize: parseInt(process.env.MAX_PAGE_SIZE || "50", 10),
  },
};

// Validate required configuration
if (config.youtubeApiKeys.length === 0) {
  logger.error("Error: YOUTUBE_API_KEYS environment variable is not set");
  process.exit(1);
}

if (config.authTokens.length === 0) {
  logger.error("Error: AUTH_TOKENS environment variable is not set");
  process.exit(1);
}

export default config;
