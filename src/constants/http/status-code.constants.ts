export const StatusCode = {
  // Respostas de Sucesso (2xx)
  OK: 200, // Requisição bem sucedida
  CREATED: 201, // Recurso criado com sucesso
  ACCEPTED: 202, // Requisição aceita para processamento
  NO_CONTENT: 204, // Processado com sucesso, sem conteúdo para retornar

  // Redirecionamentos (3xx)
  MOVED_PERMANENTLY: 301, // Recurso movido permanentemente
  FOUND: 302, // Recurso encontrado em outra URL
  NOT_MODIFIED: 304, // Recurso não modificado desde última requisição

  // Erros do Cliente (4xx)
  BAD_REQUEST: 400, // Requisição inválida ou mal formatada
  UNAUTHORIZED: 401, // Autenticação necessária
  FORBIDDEN: 403, // Sem permissão para acessar o recurso
  NOT_FOUND: 404, // Recurso não encontrado
  METHOD_NOT_ALLOWED: 405, // Método HTTP não permitido para o recurso
  CONFLICT: 409, // Conflito com o estado atual do recurso
  GONE: 410, // Recurso não disponível permanentemente
  UNPROCESSABLE_ENTITY: 422, // Entidade não pode ser processada
  TOO_MANY_REQUESTS: 429, // Muitas requisições em pouco tempo

  // Erros do Servidor (5xx)
  INTERNAL_SERVER_ERROR: 500, // Erro interno no servidor
  NOT_IMPLEMENTED: 501, // Funcionalidade não implementada
  BAD_GATEWAY: 502, // Resposta inválida do servidor upstream
  SERVICE_UNAVAILABLE: 503, // Serviço temporariamente indisponível
  GATEWAY_TIMEOUT: 504, // Timeout na comunicação com servidor upstream
} as const;

// Tipo para facilitar o uso com TypeScript
export type StatusCodeType = (typeof StatusCode)[keyof typeof StatusCode];
