import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    // Pego o usuário logado
    const user_id = request.user.id; // Passo o Id do usuário logado no ensureAuthenticate
    // Tudo que é regra de negócio, eu passei para o CreateAppointmentService
    const { provider_id, date } = request.body;

    // O parseISO converte a string de data para um objeto data
    // const parsedDate = parseISO(date); // Nao precisa mais pq a rota já converte a data

    // A injeção de dependencia está no Service
    const createAppointment = container.resolve(CreateAppointmentService); // Vai carregar o service, vai ver no constructor dele se ele precisa
    // de qualquer dependência, ele vai lá o container e vai ver se lá tem alguma dependência cadastrada com o nome passado e
    // vai retornar uma instancia

    const appointment = await createAppointment.execute({
      provider_id,
      user_id,
      date,
    });

    return response.json(appointment);
  }
}
