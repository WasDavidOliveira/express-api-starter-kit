import { HelmetOptions } from 'helmet';

export const developmentHelmetConfig: HelmetOptions = {
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: {
    policy: 'cross-origin',
  },
  hidePoweredBy: true,
  hsts: false,
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' },
  xssFilter: true,
};
