import { PostgresError } from '@/types/core/errors.types';

export const isPostgresError = (error: unknown): error is PostgresError => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  if (!('code' in error)) {
    return false;
  }

  const code = (error as { code?: unknown }).code;

  return typeof code === 'string';
};

export const extractFieldFromDetail = (
  detail?: string,
  fallback: string = 'campo',
): string => {
  if (!detail) {
    return fallback;
  }
  const match = detail.match(/\((.*?)\)=/);
  const field = match ? match[1] : fallback;
  return field.toLowerCase();
};
