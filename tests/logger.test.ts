import { LogLevel, createLogger } from '../src/utils/logger';

describe('Logger', () => {
  const originalConsole = { ...console };
  let mockDebug: jest.SpyInstance;
  let mockInfo: jest.SpyInstance;
  let mockWarn: jest.SpyInstance;
  let mockError: jest.SpyInstance;

  beforeEach(() => {
    // Create spies for console methods
    mockDebug = jest.spyOn(console, 'debug').mockImplementation();
    mockInfo = jest.spyOn(console, 'info').mockImplementation();
    mockWarn = jest.spyOn(console, 'warn').mockImplementation();
    mockError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // Restore original console
    jest.restoreAllMocks();
  });

  it('should create logger with default settings', () => {
    const logger = createLogger('TestLogger');
    
    // Log at all levels
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    
    // Default level is INFO, so debug shouldn't be called
    expect(mockDebug).not.toHaveBeenCalled();
    expect(mockInfo).toHaveBeenCalled();
    expect(mockWarn).toHaveBeenCalled();
    expect(mockError).toHaveBeenCalled();
  });

  it('should include context in log messages', () => {
    const logger = createLogger('TestContext');
    
    logger.info('Test message');
    
    // Should contain context name
    expect(mockInfo).toHaveBeenCalledWith(
      expect.stringContaining('[TestContext]')
    );
  });

  it('should format messages with timestamp', () => {
    const logger = createLogger('TestLogger');
    
    logger.info('Test message');
    
    // Should contain timestamp in ISO format
    const isoDatePattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    expect(mockInfo).toHaveBeenCalledWith(
      expect.stringMatching(isoDatePattern)
    );
  });

  it('should respect minimum log level', () => {
    const logger = createLogger('TestLogger');
    
    // Set minimum level to ERROR
    logger.setLevel(LogLevel.ERROR);
    
    // Log at all levels
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    
    // Only error should be called
    expect(mockDebug).not.toHaveBeenCalled();
    expect(mockInfo).not.toHaveBeenCalled();
    expect(mockWarn).not.toHaveBeenCalled();
    expect(mockError).toHaveBeenCalled();
  });

  it('should create child loggers with nested context', () => {
    const parentLogger = createLogger('Parent');
    const childLogger = parentLogger.child('Child');
    
    childLogger.info('Child message');
    
    // Should contain both parent and child context
    expect(mockInfo).toHaveBeenCalledWith(
      expect.stringContaining('[Parent:Child]')
    );
  });

  it('should pass additional arguments to console methods', () => {
    const logger = createLogger('TestLogger');
    const additionalArg = { key: 'value' };
    
    logger.info('Test message with object', additionalArg);
    
    // Should pass the additional argument
    expect(mockInfo).toHaveBeenCalledWith(
      expect.any(String),
      additionalArg
    );
  });

  it('should show DEBUG level messages when level set to DEBUG', () => {
    const logger = createLogger('DebugLogger');
    
    // Set minimum level to DEBUG
    logger.setLevel(LogLevel.DEBUG);
    
    logger.debug('Debug message should show');
    
    // Debug should be called
    expect(mockDebug).toHaveBeenCalled();
  });
}); 