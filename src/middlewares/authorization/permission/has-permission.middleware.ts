import { Request, Response, NextFunction } from 'express';
import { db } from '@/db/db.connection';
import { user } from '@/db/schema/v1/user.schema';
import { permissions } from '@/db/schema/v1/permission.schema';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { eq, and, inArray } from 'drizzle-orm';
import {
  ForbiddenError,
  UnauthorizedError,
} from '@/utils/core/app-error.utils';
import { PermissionAction } from '@/constants/permission.constants';
import { UserWithRoles } from '@/types/infrastructure/middlewares.types';

export const hasPermission = (
  permissionName: string,
  action: PermissionAction,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    const userData = (await db.query.user.findFirst({
      where: eq(user.id, Number(req.userId)),
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    })) as UserWithRoles | null;

    if (!userData) {
      throw new UnauthorizedError('Usuário não encontrado');
    }

    if (!userData.userRoles || userData.userRoles.length === 0) {
      throw new ForbiddenError('Usuário não possui nenhum papel atribuído');
    }

    const permission = await db.query.permissions.findFirst({
      where: and(
        eq(permissions.name, permissionName),
        eq(permissions.action, action),
      ),
    });

    if (!permission) {
      throw new ForbiddenError(
        `Permissão ${permissionName}:${action} não encontrada no sistema`,
      );
    }

    const userRoleIds = userData.userRoles.map(ur => ur.roleId);

    const hasPermission = await db.query.rolePermissions.findFirst({
      where: and(
        inArray(rolePermissions.roleId, userRoleIds),
        eq(rolePermissions.permissionId, permission.id),
      ),
    });

    if (!hasPermission) {
      throw new ForbiddenError(
        'Usuário não tem permissão para realizar esta ação',
      );
    }

    next();
  };
};
