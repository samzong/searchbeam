import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { IncomingMessage, ServerResponse } from "http";

import config from "./config";
import { authMiddleware } from "./middlewares/authMiddleware";
import searchService from "./services/searchService";
import { SearchParams } from "./types";
import logger from "./utils/logger";

// Create Fastify instance
const app: FastifyInstance = Fastify({
  logger: true,
  trustProxy: true // Trust proxy, suitable for various cloud environments
});

// Register CORS plugin
app.register(cors, {
  origin: true, // Allow all origins
  methods: ["GET", "OPTIONS"],
});

// Root route
app.get("/", async (request, reply) => {
  return {
    name: "yt-search-api",
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

// Health check route
app.get("/health", async (request, reply) => {
  return { 
    status: "ok", 
    timestamp: new Date().toISOString()
  };
});

// Search route, add authentication middleware
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
            description: "nextPageToken from previous search results, used to get next page of results" 
          },
          maxResults: { type: "number" },
          token: { type: "string" }, // Authentication token, in query parameter form
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

      // If there's an error message, return 400 status code
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

// Error handler
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Server Internal Error",
  });
});

// Start server - only when run directly
const start = async (): Promise<void> => {
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
    logger.info(`Server running in http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Check if file is run directly
if (require.main === module) {
  start();
}

// Preprocess requests, ensure application is ready
const handler = async (req: IncomingMessage, res: ServerResponse) => {
  await app.ready();
  app.server.emit('request', req, res);
};

// Export handler function, compatible with various deployment environments
export default handler;
