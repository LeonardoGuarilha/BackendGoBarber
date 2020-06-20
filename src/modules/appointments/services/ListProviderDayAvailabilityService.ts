import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

// Crio um tipo para esse IResponse, senão eu teria que no meu método, no retorno dele colocar IResponse[] para dizer que ele é um array
type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

/**
 * [ { day: 1, available: false }, { day: 2, available: true } ]
 */

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      }
    );

    // Pegar as horas disponíveis no dia
    const hourStart = 8;

    // Crio um array para pegar todos os horários possíveis, que são 10, os agendamentos podem ser feitos de 8 ãs 17(10 agendamentos)
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart // Começa as 8 e é o primeiro horário do dia
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      );

      const compareDate = new Date(year, month - 1, day, hour); // month - 1 pq janeiro é 0

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate), // Se tiver appointment: available: false. Se não tiver, available: true
        // E para o agendamento estar disponível, não pode ter appointment e a hora tem que ser depois de agora, depois do horário atual
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
