import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

// Crio um tipo para esse IResponse, senão eu teria que no meu método, no retorno dele colocar IResponse[] para dizer que ele é um array
type IResponse = Array<{
  day: number;
  available: boolean;
}>;

/**
 * [ { day: 1, available: false }, { day: 2, available: true } ]
 */

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    // Obter todos os agendamentos do agendador, no mês e no ano passados
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      }
    );

    // console.log(appointments);

    // Retorna o número de dias de um mes
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // Consigo criar um array a partir de algumas informações passadas para ele
    // Vou montar um array com os dias do mes, (_, index) => index + 1 seria o segundo parametro
    // Nele eu vou ter pelo tamanho no numberOfDaysInMonth eu começo pelo 1, ai ficaria os dias do mes
    // dia 1, 2, 3, 4, 5 assim em diante, senão iria começar do 0
    // Monto um array a partir do numero de dias do mes
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    );

    // Agendamentos de 8 às 17, um total de 10 agendamentos por isso available: appointmentsInDay.length < 10
    // Então, se eu tiver menos de 10 agendamentos, eu tenho pelo menos 1 horário disponível
    const availability = eachDayArray.map((day) => {
      // Comparar as datas para ver se a data já passou
      const compareDate = new Date(year, month - 1, day, 23, 59, 59); // lista o dia passado com o último horário do dia

      // Se existe algum appointment no dia
      const appointmentsInDay = appointments.filter((appointment) => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available:
          // Se a data do compareDate é maior que a data de hoje
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
