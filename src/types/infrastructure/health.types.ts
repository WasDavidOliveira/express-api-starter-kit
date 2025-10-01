export type HealthCheckResult = {
  ok: boolean;
  details?: Record<string, unknown>;
};

export type HealthChecks = {
  database: HealthCheckResult;
  events: HealthCheckResult;
};


