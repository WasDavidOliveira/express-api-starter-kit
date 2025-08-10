/**
 * Tipo para erros específicos do PostgreSQL
 */
export type PostgresError = Error & {
  code?: string;
  detail?: string;
};

/**
 * Tipo para representar um campo com erro de validação
 */
export type ValidationErrorItem = {
  campo: string;
  mensagem: string;
  codigo?: string;
};
