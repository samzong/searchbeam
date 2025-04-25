import config from '../config';

/**
 * 认证服务实现
 */
class AuthService {
  private readonly tokens: Set<string>;

  constructor() {
    this.tokens = new Set(config.authTokens);
  }

  /**
   * 验证Token是否有效
   * @param token 认证Token
   * @returns Boolean 是否有效
   */
  verifyToken(token: string): boolean {
    if (!token) return false;
    return this.tokens.has(token);
  }

  /**
   * 从请求头或查询参数中提取token
   * @param headers 请求头
   * @param query 查询参数
   * @returns string|undefined Token
   */
  extractToken(headers: Record<string, string>, query: Record<string, string>): string | undefined {
    // 从Authorization头中提取
    const authHeader = headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    // 从查询参数中提取
    if (query.token) {
      return query.token;
    }

    return undefined;
  }
}

// 导出单例
export default new AuthService(); 