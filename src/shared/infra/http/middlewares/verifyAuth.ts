import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/authconfig';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: number;
}

export default function verifyAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): Response<NextFunction> | void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('jwt token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as ITokenPayload;
    request.body.user = { id: sub };
    response.locals.userId = sub;

    return next();
  } catch {
    throw new AppError('Invalid JWT token');
  }
}
