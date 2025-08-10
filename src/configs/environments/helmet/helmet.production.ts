import { HelmetOptions } from 'helmet';

export const productionHelmetConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      // eslint-disable-next-line quotes
      defaultSrc: ["'self'"],
      // eslint-disable-next-line quotes
      connectSrc: ["'self'"],
      // eslint-disable-next-line quotes
      frameSrc: ["'none'"],
      // eslint-disable-next-line quotes
      objectSrc: ["'none'"],
    },
  },
  crossOriginResourcePolicy: {
    policy: 'same-origin',
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' },
  xssFilter: true,
};
