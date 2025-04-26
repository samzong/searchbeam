/**
 * Logger utility for the application
 * Provides a consistent logging interface with different log levels
 */

// Define log levels
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Logger configuration
interface LoggerConfig {
  minLevel: LogLevel;
  enableTimestamp: boolean;
  enableConsole: boolean;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: LogLevel.INFO, // Default to show INFO and higher levels
  enableTimestamp: true,   // Include timestamps by default
  enableConsole: true,     // Log to console by default
};

class Logger {
  private config: LoggerConfig;
  private context: string;

  constructor(context: string = 'App', config: Partial<LoggerConfig> = {}) {
    this.context = context;
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Format a log message with context and timestamp
   */
  private formatMessage(level: string, message: string): string {
    const timestamp = this.config.enableTimestamp ? `[${new Date().toISOString()}] ` : '';
    return `${timestamp}${level} [${this.context}] ${message}`;
  }

  /**
   * Log debug level message
   */
  debug(message: string, ...args: any[]): void {
    if (this.config.minLevel <= LogLevel.DEBUG) {
      const formattedMessage = this.formatMessage('DEBUG', message);
      if (this.config.enableConsole) {
        console.debug(formattedMessage, ...args);
      }
    }
  }

  /**
   * Log info level message
   */
  info(message: string, ...args: any[]): void {
    if (this.config.minLevel <= LogLevel.INFO) {
      const formattedMessage = this.formatMessage('INFO', message);
      if (this.config.enableConsole) {
        console.info(formattedMessage, ...args);
      }
    }
  }

  /**
   * Log warning level message
   */
  warn(message: string, ...args: any[]): void {
    if (this.config.minLevel <= LogLevel.WARN) {
      const formattedMessage = this.formatMessage('WARN', message);
      if (this.config.enableConsole) {
        console.warn(formattedMessage, ...args);
      }
    }
  }

  /**
   * Log error level message
   */
  error(message: string, ...args: any[]): void {
    if (this.config.minLevel <= LogLevel.ERROR) {
      const formattedMessage = this.formatMessage('ERROR', message);
      if (this.config.enableConsole) {
        console.error(formattedMessage, ...args);
      }
    }
  }

  /**
   * Create a child logger with a different context
   */
  child(context: string): Logger {
    return new Logger(`${this.context}:${context}`, this.config);
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.config.minLevel = level;
  }
}

// Create and export default logger instance
const defaultLogger = new Logger();

// Export LogLevel enum for consumers
export { LogLevel };

// Factory function to create loggers for different components
export function createLogger(context: string): Logger {
  return new Logger(context);
}

export default defaultLogger; 