import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

import config from "./config";
import { authMiddleware } from "./middlewares/authMiddleware";
import searchService from "./services/searchService";
import { SearchParams } from "./types";

// 创建Fastify实例
const app: FastifyInstance = Fastify({
  logger: true,
});

// 注册CORS插件
app.register(cors, {
  origin: config.cors.origin,
  methods: ["GET", "OPTIONS"],
});

// 健康检查路由
app.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
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
          pageToken: { type: "string" },
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

// 启动服务器
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

// 导出应用实例，便于测试
export default app;
