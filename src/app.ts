import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { IncomingMessage, ServerResponse } from "http";

import config from "./config";
import { authMiddleware } from "./middlewares/authMiddleware";
import searchService from "./services/searchService";
import { SearchParams } from "./types";

// 创建Fastify实例
const app: FastifyInstance = Fastify({
  logger: true,
  trustProxy: true // 信任代理，适用于各种云环境
});

// 注册CORS插件
app.register(cors, {
  origin: true, // 允许所有来源
  methods: ["GET", "OPTIONS"],
});

// 根路由
app.get("/", async (request, reply) => {
  return {
    name: "searchbeam",
    description: "High-performance cloud video search API service, proxy multi-platform search request.",
    version: "1.0.0",
    endpoints: [
      { path: "/health", description: "Health check endpoint" },
      { path: "/search?platform=youtube&q=baby", description: "Search endpoint, requires authentication" },
      { 
        path: "/search?platform=youtube&q=baby&pageToken=ABC123", 
        description: "Search with pageToken for pagination" 
      }
    ]
  };
});

// 健康检查路由
app.get("/health", async (request, reply) => {
  return { 
    status: "ok", 
    timestamp: new Date().toISOString()
  };
});

// 搜索路由，添加认证中间件
app.get(
  "/search",
  {
    preHandler: authMiddleware,
    schema: {
      querystring: {
        type: "object",
        required: ["platform", "q"],
        properties: {
          platform: { type: "string" },
          q: { type: "string" },
          pageToken: { 
            type: "string",
            description: "从上一次搜索结果中获取的nextPageToken，用于获取下一页结果" 
          },
          maxResults: { type: "number" },
          token: { type: "string" }, // 认证Token, 查询参数形式
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const { platform, q, pageToken, maxResults } =
        request.query as SearchParams;

      const result = await searchService.search({
        platform,
        q,
        pageToken,
        maxResults,
      });

      // 如果有错误信息，返回400状态码
      if (result.error) {
        reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: result.error,
        });
        return;
      }

      return result;
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Server Internal Error",
      });
    }
  },
);

// 错误处理
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Server Internal Error",
  });
});

// 启动服务器 - 仅在直接运行时启动
const start = async (): Promise<void> => {
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`Server running in http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// 检查是否是直接运行此文件
if (require.main === module) {
  start();
}

// 预处理请求，确保应用已准备就绪
const handler = async (req: IncomingMessage, res: ServerResponse) => {
  await app.ready();
  app.server.emit('request', req, res);
};

// 导出通用处理函数，兼容多种部署环境
export default handler;
