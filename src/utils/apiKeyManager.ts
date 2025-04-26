import { createLogger } from "./logger";

// Create logger instance for API key management
const keyLogger = createLogger("ApiKeyManager");

/**
 * API Key Manager
 * Responsible for load-balanced distribution and management of multiple API keys
 */
class ApiKeyManager {
  private allKeys: string[] = [];            // All keys, including limited ones
  private availableKeys: string[] = [];      // Currently available keys
  private keyUsageCount: Map<string, number> = new Map();
  private keyLimitTime: Map<string, number> = new Map();
  
  // Default quota reset time (24 hours in milliseconds)
  private readonly QUOTA_RESET_TIME = 24 * 60 * 60 * 1000;
  
  constructor(keys: string[], quotaResetTime?: number) {
    this.allKeys = [...keys];
    this.availableKeys = [...keys];
    
    // Set custom quota reset time if provided
    if (quotaResetTime) {
      this.QUOTA_RESET_TIME = quotaResetTime;
    }
    
    // Initialize usage count
    keys.forEach(key => this.keyUsageCount.set(key, 0));
    
    keyLogger.info(`Initialized with ${keys.length} API keys`);
    
    // Start automatic recovery check
    this.startAutoRecovery();
  }
  
  /**
   * Get the next available API key based on load balancing
   */
  getNextKey(): string {
    // Check if any keys are available
    if (this.availableKeys.length === 0) {
      keyLogger.warn("No available API keys, attempting to recover limited keys");
      this.checkAndRecoverKeys();
      
      if (this.availableKeys.length === 0) {
        keyLogger.error("No API keys available after recovery attempt");
        throw new Error("No API keys available");
      }
    }
    
    // Find the key with the lowest usage count
    let minUsage = Number.MAX_SAFE_INTEGER;
    let selectedKeyIndex = 0;
    
    this.availableKeys.forEach((key, index) => {
      const usage = this.keyUsageCount.get(key) || 0;
      if (usage < minUsage) {
        minUsage = usage;
        selectedKeyIndex = index;
      }
    });
    
    const key = this.availableKeys[selectedKeyIndex];
    
    // Update usage count
    const count = this.keyUsageCount.get(key) || 0;
    this.keyUsageCount.set(key, count + 1);
    
    keyLogger.debug(`Selected API key ${key.substring(0, 6)}... with usage count: ${count + 1}`);
    
    return key;
  }
  
  /**
   * Mark a key as quota limited
   * @param key The API key that hit quota limit
   */
  markKeyLimited(key: string): void {
    const index = this.availableKeys.indexOf(key);
    if (index !== -1) {
      // Remove from available list
      this.availableKeys.splice(index, 1);
      
      // Store the time when the key was limited
      this.keyLimitTime.set(key, Date.now());
      
      keyLogger.warn(`API key ${key.substring(0, 6)}... marked as limited. ${this.availableKeys.length} keys remaining.`);
    }
  }
  
  /**
   * Check and recover keys that have passed the quota reset time
   */
  private checkAndRecoverKeys(): void {
    const now = Date.now();
    let recoveredCount = 0;
    
    this.keyLimitTime.forEach((limitTime, key) => {
      if (now - limitTime >= this.QUOTA_RESET_TIME) {
        // Key has likely recovered, add back to available list if not already there
        if (!this.availableKeys.includes(key) && this.allKeys.includes(key)) {
          this.availableKeys.push(key);
          this.keyLimitTime.delete(key);
          recoveredCount++;
          
          // Reset usage count
          this.keyUsageCount.set(key, 0);
          
          keyLogger.info(`Recovered API key ${key.substring(0, 6)}... after quota reset period`);
        }
      }
    });
    
    if (recoveredCount > 0) {
      keyLogger.info(`Recovered ${recoveredCount} API keys after quota reset period.`);
    }
  }
  
  /**
   * Start automatic recovery check at regular intervals
   */
  private startAutoRecovery(): void {
    // Check every hour for recovered keys
    setInterval(() => {
      keyLogger.debug("Running scheduled API key recovery check");
      this.checkAndRecoverKeys();
    }, 60 * 60 * 1000);
    
    keyLogger.info("Automatic API key recovery check scheduled (hourly)");
  }
  
  /**
   * Get count of available keys
   */
  getAvailableKeyCount(): number {
    return this.availableKeys.length;
  }
  
  /**
   * Get total number of keys (both available and limited)
   */
  getTotalKeyCount(): number {
    return this.allKeys.length;
  }
  
  /**
   * Get usage statistics for all keys
   */
  getKeyStats(): any {
    const stats = {
      total: this.allKeys.length,
      available: this.availableKeys.length,
      limited: this.allKeys.length - this.availableKeys.length,
      usage: {} as Record<string, number>
    };
    
    this.allKeys.forEach(key => {
      const maskedKey = `${key.substring(0, 6)}...`;
      stats.usage[maskedKey] = this.keyUsageCount.get(key) || 0;
    });
    
    return stats;
  }
}

export default ApiKeyManager; 