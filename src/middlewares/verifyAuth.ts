import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/authconfig';

interface TokenPayload {
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
    throw new Error('jwt token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as TokenPayload;
    request.body.user = { id: sub };
    response.locals.userId = sub;

    return next();
  } catch {
    throw new Error('Invalid JWT token');
  }
}
