import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();
profileRouter.use(ensureAuthenticated); // As rotas de perfil não estão acessiveis se o usuário não estiver autenticado

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')), // O único valor válido para o password_confirmation é o valor que te, dentro do password
    },
  }),
  profileController.update
);

export default profileRouter;
