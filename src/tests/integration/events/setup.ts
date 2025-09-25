import dotenv from 'dotenv';
import path from 'path';
import { vi } from 'vitest';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

vi.mock('@/events/core/event-emitter', () => ({
  emitAppEvent: vi.fn(),
  onAppEvent: vi.fn(),
  onceAppEvent: vi.fn(),
}));

vi.mock('@/services/notification/notification-manager.service', () => ({
  NotificationManagerService: {
    initialize: vi.fn(),
  },
}));

vi.mock('@/services/analytics/activity-log.service', () => ({
  ActivityLogService: {
    initialize: vi.fn(),
  },
}));
