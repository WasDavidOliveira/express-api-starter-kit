import fs from 'fs';
import path from 'path';
import { OpenAPISpec } from '@/types/core/openapi.types';

export const updateOpenAPISpec = (newSpec: OpenAPISpec) => {
  const openapiPath = path.resolve(process.cwd(), 'src/docs/openapi.json');

  fs.writeFileSync(openapiPath, JSON.stringify(newSpec, null, 2));
};

export const readOpenAPISpec = (): OpenAPISpec | null => {
  const openapiPath = path.resolve(process.cwd(), 'src/docs/openapi.json');

  if (fs.existsSync(openapiPath)) {
    return JSON.parse(fs.readFileSync(openapiPath, 'utf8'));
  }

  return null;
};
