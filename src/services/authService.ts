import config from "../config";

/**
 * Authentication service implementation
 */
class AuthService {
  private readonly tokens: Set<string>;

  constructor() {
    this.tokens = new Set(config.authTokens);
  }

  /**
   * Verify if token is valid
   * @param token Authentication token
   * @returns Boolean indicating if token is valid
   */
  verifyToken(token: string): boolean {
    if (!token) return false;
    return this.tokens.has(token);
  }

  /**
   * Extract token from request headers or query parameters
   * @param headers Request headers
   * @param query Query parameters
   * @returns string|undefined Token
   */
  extractToken(
    headers: Record<string, string>,
    query: Record<string, string>,
  ): string | undefined {
    // Extract from Authorization header
    const authHeader = headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7);
    }

    // Extract from query parameters
    if (query.token) {
      return query.token;
    }

    return undefined;
  }
}

// Export singleton instance
export default new AuthService();
