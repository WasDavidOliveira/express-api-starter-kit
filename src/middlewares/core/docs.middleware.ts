import { Application, Request, Response } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import { scalarConfig } from '@/configs/docs.config';
import path from 'path';
import fs from 'fs';
import { generateOpenAPIDocument } from '@/utils/documentation/openapi.utils';

export const configureDocs = (app: Application) => {
  generateOpenAPIDocument();

  app.get('/openapi.json', (req: Request, res: Response) => {
    const openapiPath = path.resolve(process.cwd(), 'src/docs/openapi.json');

    if (fs.existsSync(openapiPath)) {
      res.sendFile(openapiPath);
    } else {
      res.status(404).send('Arquivo OpenAPI não encontrado');
    }
  });

  app.use(
    '/docs',
    apiReference({
      url: '/openapi.json',
      theme: scalarConfig.theme,
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'fetch',
      },
    })
  );
};
