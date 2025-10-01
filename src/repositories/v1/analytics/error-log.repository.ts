import { BaseRepository } from '@/repositories/v1/base/base.repository';
import { errorLogs } from '@/db/schema/v1/error-log.schema';
import {
  ErrorLogModel,
  CreateErrorLogModel,
} from '@/types/models/v1/error-log.types';

export class ErrorLogRepository extends BaseRepository<
  ErrorLogModel,
  CreateErrorLogModel
> {
  protected table = errorLogs;
  protected idColumn = errorLogs.id;
  protected tableName = 'error_logs';
  protected enableActivityLog = false;
}
