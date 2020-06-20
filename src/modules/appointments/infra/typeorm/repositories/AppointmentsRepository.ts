// Tudo relacionado ao BD vai ficar no repositório
// Esse Repositpry é muito dependente do typeorm(Repositório específico do typeorm), então coloquei ele na camada de infra
// Repositório específico para o typeorm, com a dependência do typeorm. posso trocar depois de typeorm para qualquer outro
// Mas eu posso manter o nome do método, com os parâmentros e o retorno
import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

// Repository<Appointmnent>, passo um parametro para o Repository, o <> significa que eu estou passando um paramentro
// implemento a minha interface nessa classe "implements IAppointmentsRepository"
class AppointmentRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment); // Crio o repositório
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const findAppointmentInSameDate = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointmentInSameDate;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    // padStart - se a minha string não tiver 2 digitos ela vai preencher os digitos faltantes com 0. padL no delphi
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        // O typeORM muda os nomes dos campos passados, então dentro do Raw, eu passo uma funcao e pego o nome que o typeORM da para o date passado
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    // padStart - se a minha string não tiver 2 digitos ela vai preencher os digitos faltantes com 0. padL no delphi
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        // O typeORM muda os nomes dos campos passados, então dentro do Raw, eu passo uma funcao e pego o nome que o typeORM da para o date passado
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      relations: ['user'], // join com o usuário. Eager Loading
    });

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    // Já vou criar e salvar o appointment direto

    // Criar a instancia do appointment, cria o objeto
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    // Salvar o repositorio no banco de dados
    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
