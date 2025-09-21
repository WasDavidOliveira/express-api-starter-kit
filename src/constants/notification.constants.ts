export const NOTIFICATION_LEVEL_COLORS = {
  success: 0x00ff00,
  warning: 0xffa500,
  info: 0x0099ff,
  error: 0xff0000,
} as const;

export const NOTIFICATION_LEVEL_EMOJIS = {
  success: '✅',
  warning: '⚠️',
  info: 'ℹ️',
  error: '❌',
} as const;

export const ERROR_TYPE_COLORS = {
  ValidationError: 0xffa500,
  TypeError: 0xff6b6b, // Red
  ReferenceError: 0xff6b6b, // Red
  SyntaxError: 0xff6b6b, // Red
  NetworkError: 0x4ecdc4, // Teal
  DatabaseError: 0xff6b6b, // Red
  AuthenticationError: 0xffd93d, // Yellow
  AuthorizationError: 0xff6b6b, // Red
  NotFoundError: 0x95a5a6, // Gray
  TimeoutError: 0xffa500, // Orange
  RateLimitError: 0xffa500, // Orange
  InternalServerError: 0xff0000, // Bright Red
} as const;

export type NotificationLevel = keyof typeof NOTIFICATION_LEVEL_COLORS;
export type ErrorType = keyof typeof ERROR_TYPE_COLORS;
