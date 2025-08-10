import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da role é obrigatório'),
    description: z.string().min(1, 'A descrição da role é obrigatória'),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da role é obrigatório'),
    description: z.string().min(1, 'A descrição da role é obrigatória'),
  }),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>['body'];
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>['body'];
