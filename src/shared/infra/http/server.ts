import 'reflect-metadata';
import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder)); // http://localhost:3333/files/nome_imagem_com_a_extensão
app.use(rateLimiter);
app.use(routes);
app.use(errors());

// Middleware para tratativa de erros, o "_" seria o next do middleware, mas eu não vou utilizar ele
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // verifico se o meu erro é uma instancia da classe AppError
  if (err instanceof AppError) {
    // Se for uma instancia de AppError, foi um erro gerado pela minha aplicação
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
