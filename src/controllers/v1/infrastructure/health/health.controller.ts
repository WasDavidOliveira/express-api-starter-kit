import { Request, Response } from 'express';
import HealthService from '@/services/v1/infrastructure/health.service';
import { StatusCode } from '@/constants/http';

export class HealthController {
  index = async (_req: Request, res: Response) => {
    const checks = await HealthService.check();

    const isOk = checks.database.ok && checks.events.ok;
    if (!isOk) {
      res.status(StatusCode.SERVICE_UNAVAILABLE).json({
        status: 'unhealthy',
        checks,
      });
      return;
    }

    res.status(StatusCode.OK).json({
      status: 'ok',
      checks,
    });
  };
}

export default new HealthController();
