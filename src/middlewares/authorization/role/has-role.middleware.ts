import { Request, Response, NextFunction } from 'express';
import { db } from '@/db/db.connection';
import { user } from '@/db/schema/v1/user.schema';
import { eq } from 'drizzle-orm';
import { ForbiddenError, UnauthorizedError } from '@/exceptions/app.exceptions';
import { UserWithRoles } from '@/types/infrastructure/middlewares.types';

export const hasRole = (roleName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new UnauthorizedError('Usuário não autenticado.');
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
      throw new UnauthorizedError('Usuário não encontrado.');
    }

    const userRoles = userData.userRoles.map(ur => ur.role.name);

    if (!userRoles.includes(roleName)) {
      throw new ForbiddenError('Você não possui acesso a este recurso.');
    }

    next();
  };
};
