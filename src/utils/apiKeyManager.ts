/**
 * API密钥管理器
 * 负责轮询分配和管理多个API密钥
 */
class ApiKeyManager {
  private keys: string[] = [];
  private currentIndex = 0;
  private keyUsageCount: Map<string, number> = new Map();
  
  constructor(keys: string[]) {
    this.keys = keys;
    // 初始化使用计数
    keys.forEach(key => this.keyUsageCount.set(key, 0));
  }
  
  /**
   * 获取下一个可用的API密钥
   */
  getNextKey(): string {
    if (this.keys.length === 0) {
      throw new Error("No API keys available");
    }
    
    const key = this.keys[this.currentIndex];
    // 更新索引到下一个
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    
    // 更新使用计数
    const count = this.keyUsageCount.get(key) || 0;
    this.keyUsageCount.set(key, count + 1);
    
    return key;
  }
  
  /**
   * 标记密钥达到配额限制
   * 可在错误处理中调用
   */
  markKeyLimited(key: string): void {
    const index = this.keys.indexOf(key);
    if (index !== -1) {
      // 从可用列表中移除
      this.keys.splice(index, 1);
      // 如果当前索引大于数组长度，重置索引
      if (this.currentIndex >= this.keys.length && this.keys.length > 0) {
        this.currentIndex = 0;
      }
    }
  }
  
  /**
   * 获取可用密钥数量
   */
  getAvailableKeyCount(): number {
    return this.keys.length;
  }
}

export default ApiKeyManager; 