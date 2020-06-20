import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmetsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmetsController = new AppointmetsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

// http://localhost:3333/appointments
// Aqui eu deixo só o "/" na rota pq no index.ts de routes, eu coloquei o .use('/appointments')
// appointmentsRouter.get('/', async (request, response) => {
//   console.log(request.user);
//   // Caso não tenha nenhuma regra de negócio, eu posso ir direto da rota para o repositório

//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

// O celebrate faz as validações

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmetsController.create
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
