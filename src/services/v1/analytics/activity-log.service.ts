import { onAppEvent } from '@/events/core/event-emitter';
import { ActivityLogEvent } from '@/types/core/activityLog.types';
import { eq } from 'drizzle-orm';
import activityLogRepository from '@/repositories/v1/analytics/activity-log.repository';

export class ActivityLogService {
  private static instance: ActivityLogService | null = null;

  protected constructor() {
    this.setupEventListeners();
  }

  static initialize(): void {
    if (this.instance) {
      return;
    }

    this.instance = new ActivityLogService();
  }

  protected setupEventListeners(): void {
    onAppEvent('activity_log', event => {
      if (event.type === 'activity_log') {
        void this.handleActivityLogEvent(event as ActivityLogEvent);
      }
    });
  }

  protected async handleActivityLogEvent(
    event: ActivityLogEvent,
  ): Promise<void> {
    const { data } = event;

    await activityLogRepository.create({
      userId: data.userId,
      action: data.action,
      tableName: data.tableName,
      recordId: data.recordId,
      oldValues: data.oldValues,
      newValues: data.newValues,
      userAgent: data.userAgent,
      ip: data.ip,
    });
  }

  async getActivityLogsByTable(tableName: string) {
    return activityLogRepository.findByCondition(
      eq(activityLogRepository['table'].tableName, tableName),
    );
  }

  async getActivityLogsByUser(userId: number) {
    return activityLogRepository.findByCondition(
      eq(activityLogRepository['table'].userId, userId),
    );
  }

  async getActivityLogsByAction(action: 'CREATE' | 'UPDATE' | 'DELETE') {
    return activityLogRepository.findByCondition(
      eq(activityLogRepository['table'].action, action),
    );
  }
}
