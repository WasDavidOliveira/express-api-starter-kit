import { activityLogs } from '@/db/schema/v1/activity-log.schema';
import { BaseRepository } from '@/repositories/v1/base/base.repository';
import { getTableName } from 'drizzle-orm';
import {
  CreateActivityLogModel,
  ActivityLogModel,
} from '@/types/core/activityLog.types';

class ActivityLogRepository extends BaseRepository<
  ActivityLogModel,
  CreateActivityLogModel
> {
  protected table = activityLogs;
  protected idColumn = activityLogs.id;
  protected tableName = getTableName(activityLogs);
}

export default new ActivityLogRepository();
