import { Request, Response, NextFunction } from 'express';
import { db } from '@/db/db.connection';
import { user } from '@/db/schema/v1/user.schema';
import { permissions } from '@/db/schema/v1/permission.schema';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { eq, and, inArray, or } from 'drizzle-orm';
import {
  ForbiddenError,
  UnauthorizedError,
} from '@/utils/core/app-error.utils';
import { PermissionCheck } from '@/types/models/v1/permission.types';
import { UserWithRoles } from '@/types/infrastructure/middlewares.types';

export const hasAnyPermission = (permissionChecks: PermissionCheck[]) => {
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

    const userRoleIds = userData.userRoles.map(ur => ur.roleId);

    const permissionConditions = permissionChecks.map(({ name, action }) =>
      and(eq(permissions.name, name), eq(permissions.action, action)),
    );

    const permissionList = await db.query.permissions.findMany({
      where: or(...permissionConditions),
    });

    if (permissionList.length === 0) {
      const requestedPermissions = permissionChecks.map(
        p => `${p.name}:${p.action}`,
      );

      throw new ForbiddenError(
        `Nenhuma das permissões especificadas foi encontrada: ${requestedPermissions.join(', ')}`,
      );
    }

    const permissionIds = permissionList.map(p => p.id);
    const userRolePermissions = await db.query.rolePermissions.findMany({
      where: and(
        inArray(rolePermissions.roleId, userRoleIds),
        inArray(rolePermissions.permissionId, permissionIds),
      ),
    });

    if (userRolePermissions.length === 0) {
      const availablePermissions = permissionList.map(
        p => `${p.name}:${p.action}`,
      );

      throw new ForbiddenError(
        `Usuário não possui nenhuma das seguintes permissões: ${availablePermissions.join(', ')}`,
      );
    }

    next();
  };
};
