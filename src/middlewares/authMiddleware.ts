import { FastifyRequest, FastifyReply } from "fastify";
import authService from "../services/authService";

/**
 * 身份验证中间件
 * 验证请求中的Token是否有效
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    // 从请求中提取token
    const token = authService.extractToken(
      request.headers as Record<string, string>,
      request.query as Record<string, string>,
    );

    // 如果没有提供token，返回401
    if (!token) {
      reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Missing authentication token",
      });
      return;
    }

    // 验证token有效性
    const isValid = authService.verifyToken(token);
    if (!isValid) {
      reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid authentication token",
      });
      return;
    }

    // 认证通过，继续后续处理
  } catch (error) {
    console.error("Authentication process error:", error);
    reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Authentication process error",
    });
  }
}
