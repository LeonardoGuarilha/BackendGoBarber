import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig.multer);

// http://localhost:3333/users
// Aqui eu deixo só o "/" na rota pq no index.ts de routes, eu coloquei o .use('/appointments')
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);

// Uso o patch pq eu quero atualizar somente um campo do usuário
// http://localhost:3333/users/avatar
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'), // dentro do single eu coloco qual o nome do campo que vai conter a imagem quando eu chamar essa rota
  // Coloco esse nome "avatar" também no Multpart from no insomnia
  userAvatarController.update
);

export default usersRouter;
