import { getMongoRepository, MongoRepository } from 'typeorm';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    // Já vou criar e salvar o appointment direto

    // Criar a instancia da notification, cria o objeto
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    // Salvar o repositorio no banco de dados
    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
