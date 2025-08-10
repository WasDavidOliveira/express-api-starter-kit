export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head';

export type PathItem = {
  summary?: string;
  description?: string;
  parameters?: PathParameter[];
  responses?: Record<string, PathResponse>;
  requestBody?: RequestBody;
  [key: string]: unknown;
};

export type PathParameter = {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema?: SchemaObject;
  [key: string]: unknown;
};

export type PathResponse = {
  description: string;
  content?: Record<string, { schema: SchemaObject }>;
  [key: string]: unknown;
};

export type RequestBody = {
  description?: string;
  content: Record<string, { schema: SchemaObject }>;
  required?: boolean;
  [key: string]: unknown;
};

export type SchemaObject = {
  type?: string;
  format?: string;
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  required?: string[];
  enum?: unknown[];
  [key: string]: unknown;
};

export type OpenAPISpec = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, Record<HttpMethod, PathItem>>;
  components?: {
    schemas?: Record<string, SchemaObject>;
    securitySchemes?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
