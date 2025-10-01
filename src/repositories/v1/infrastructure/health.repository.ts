import { db } from '@/db/db.connection';
import { eventEmitter } from '@/events/core/event-emitter';
import type { Pool } from 'pg';
import type { HealthCheckResult } from '@/types/infrastructure/health.types';

export class HealthRepository {
  protected getPool(): Pool | null {
    const anyDb = db as unknown as { client?: unknown };
    const client = anyDb?.client as Pool | undefined;
    if (!client) {
      return null;
    }
    return client;
  }

  async checkDatabase(): Promise<HealthCheckResult> {
    const pool = this.getPool();
    if (!pool) {
      return { ok: false, details: { reason: 'pool_not_available' } };
    }

    const client = await pool.connect().catch(() => null);
    if (!client) {
      return { ok: false, details: { reason: 'connection_failed' } };
    }

    const result = await client.query('SELECT 1').catch(() => null);
    client.release();
    if (!result) {
      return { ok: false, details: { reason: 'query_failed' } };
    }

    return { ok: true };
  }

  checkEvents(): HealthCheckResult {
    const maxListeners = eventEmitter.getMaxListeners();
    const eventNames = eventEmitter.eventNames();

    if (!eventNames.length) {
      return { ok: false, details: { reason: 'no_listeners' } };
    }

    return { ok: true, details: { maxListeners, eventNames } };
  }
}
