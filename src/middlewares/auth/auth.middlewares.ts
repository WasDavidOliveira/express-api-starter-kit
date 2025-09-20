import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import appConfig from '@/configs/app.config';
import { UnauthorizedError } from '@/exceptions/app.exceptions';
import { JwtPayload } from '@/types/core/jwt.types';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token não fornecido');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, appConfig.jwtSecret) as JwtPayload;

    req.userId = decoded.id;

    next();
  } catch {
    throw new UnauthorizedError('Token inválido');
  }
};
