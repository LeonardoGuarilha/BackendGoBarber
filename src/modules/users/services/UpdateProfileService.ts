// Primeiro de tudo: Crio o service com o mínimo possível para fazer o teste passar.
// A estrutura para o teste não dar erro

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashPRovider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashPRovider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    // Coloco esse userWithUpdatedEmail.id !== user_id pq eu não preciso alterar o email
    // Posso só trocar o nome, ai quando eu colocar o e-mail que será o mesmo, vai cair no throw new AppError('E-mail already in use');
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    // Se o password estiver informado mas o old_password não
    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.'
      );
    }

    // Se o password estiver preenchido e se eu tenho o old_password
    if (password && old_password) {
      // Verifico se a senha dele bate com a old_password
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    // Quando eu retorno direto assim eu não preciso do await
    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
