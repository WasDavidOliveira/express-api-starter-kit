import { HealthRepository } from '@/repositories/v1/infrastructure/health.repository';
import type { HealthChecks } from '@/types/infrastructure/health.types';

export class HealthService {
  protected repository: HealthRepository;

  constructor(repository?: HealthRepository) {
    this.repository = repository ?? new HealthRepository();
  }

  async check(): Promise<HealthChecks> {
    const [db, events] = await Promise.all([
      this.repository.checkDatabase(),
      Promise.resolve(this.repository.checkEvents()),
    ]);

    return { database: db, events };
  }
}

export default new HealthService();
