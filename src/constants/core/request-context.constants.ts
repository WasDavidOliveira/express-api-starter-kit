import { v4 as uuidv4 } from 'uuid';
import { RequestContextOptions } from '@/types/core/request-context.types';

export const REQUEST_CONTEXT_DEFAULT_OPTIONS: Required<RequestContextOptions> =
  {
    generateRequestId: () => uuidv4(),
    includeUserInfo: true,
    includeMetadata: true,
    maxMetadataSize: 1000,
  };
