import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { PermissionActions } from '@/constants/permission.constants';

extendZodWithOpenApi(z);

export const createPermissionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da permissão é obrigatório'),
    description: z.string().min(1, 'A descrição da permissão é obrigatória'),
    action: z.nativeEnum(PermissionActions),
  }),
});

export const updatePermissionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da permissão é obrigatório'),
    description: z.string().min(1, 'A descrição da permissão é obrigatória'),
    action: z.nativeEnum(PermissionActions),
  }),
});

export type CreatePermissionInput = z.infer<
  typeof createPermissionSchema
>['body'];
export type UpdatePermissionInput = z.infer<
  typeof updatePermissionSchema
>['body'];
