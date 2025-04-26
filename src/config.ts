import dotenv from "dotenv";
import { join } from "path";

// 加载环境变量
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

// 从环境变量获取配置，提供默认值
const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  youtubeApiKeys: (process.env.YOUTUBE_API_KEYS || "").split(",").filter(Boolean),
  authTokens: (process.env.AUTH_TOKENS || "").split(",").filter(Boolean),
  cache: {
    maxItems: parseInt(process.env.CACHE_MAX_ITEMS || "1000", 10),
    ttl: parseInt(process.env.CACHE_TTL || "600000", 10), // 默认10分钟
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

// 验证必要的配置
if (config.youtubeApiKeys.length === 0) {
  console.error("Error: YOUTUBE_API_KEYS environment variable is not set");
  process.exit(1);
}

if (config.authTokens.length === 0) {
  console.error("Error: AUTH_TOKENS environment variable is not set");
  process.exit(1);
}

export default config;
