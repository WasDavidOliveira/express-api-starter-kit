import dotenv from 'dotenv';
import path from 'path';
import { vi } from 'vitest';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

vi.mock('@/events', () => ({
  emitAppEvent: vi.fn(),
  onAppEvent: vi.fn(),
  onceAppEvent: vi.fn(),
  sendErrorNotification: vi.fn(),
}));

vi.mock('@/services/notification/notification-manager.service', () => ({
  NotificationManagerService: {
    initialize: vi.fn(),
  },
}));

vi.mock('@/services/v1/analytics/activity-log.service', () => ({
  ActivityLogService: {
    initialize: vi.fn(),
  },
}));
