import { FastifyRequest, FastifyReply } from "fastify";
import authService from "../services/authService";
import logger from "../utils/logger";

/**
 * Authentication middleware
 * Validates if the token in the request is valid
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    // Extract token from request
    const token = authService.extractToken(
      request.headers as Record<string, string>,
      request.query as Record<string, string>,
    );

    // If no token provided, return 401
    if (!token) {
      reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Missing authentication token",
      });
      return;
    }

    // Verify token validity
    const isValid = authService.verifyToken(token);
    if (!isValid) {
      reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid authentication token",
      });
      return;
    }

    // Authentication passed, continue processing
  } catch (error) {
    logger.error("Authentication process error:", error);
    reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Authentication process error",
    });
  }
}
