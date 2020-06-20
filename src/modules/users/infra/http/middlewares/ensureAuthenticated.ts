import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  // Validação do token JWT

  // Pego o token do header
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // vou ter que dividir o token que está nesse formato: Bearer aefsdufasiua
  // A primeira posição da desestruturação é o type, mas como eu não vou usar, eu posso deixar vazio
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    // console.log(decoded);
    // Tudo que eu incluir no request e no response será passado para as próxiamas rotas executadas depois desse middleware
    // Incluo a informação do usuário logado para os próximos middlewares
    const { sub } = decoded as ITokenPayload; // digo que o tipo desse decoded é TokenPayload
    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
