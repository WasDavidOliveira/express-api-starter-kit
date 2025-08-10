import path from 'path';
import fs from 'fs';

export const getOpenAPISpec = () => {
  const openapiPath = path.resolve(process.cwd(), 'src/docs/openapi.json');

  if (fs.existsSync(openapiPath)) {
    return JSON.parse(fs.readFileSync(openapiPath, 'utf8'));
  }

  throw new Error('Arquivo OpenAPI não encontrado');
};

export const scalarConfig = {
  theme: 'kepler',
  defaultHttpClient: {
    targetKey: 'javascript',
    clientKey: 'fetch',
  },
};
