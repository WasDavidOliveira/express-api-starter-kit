import { BaseEventHandler } from '@/events/core/base-event-handler';
import { AppEvent } from '@/types/core/events.types';
import { ActivityLogEvent } from '@/types/core/activityLog.types';
import { eq } from 'drizzle-orm';
import activityLogRepository from '@/repositories/v1/analytics/activity-log.repository';

export class ActivityLogService extends BaseEventHandler {
  private static instance: ActivityLogService | null = null;

  protected constructor() {
    super();
    this.setupEventListeners();
  }

  static initialize(): void {
    if (this.instance) {
      return;
    }

    this.instance = new ActivityLogService();
  }

  protected getEventHandlers() {
    return [
      {
        eventType: 'activity_log',
        handler: async (event: AppEvent) =>
          this.handleActivityLogEvent(event as ActivityLogEvent),
      },
    ];
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
