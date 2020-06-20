import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticaTeUserService from '@modules/users/services/AuthenticateUserService';

// index, show, create, update, delete os 5 métodos de um controller

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticaceUser = container.resolve(AuthenticaTeUserService);

    const { user, token } = await authenticaceUser.execute({
      email,
      password,
    });

    // O classToClass() via pegar uma ou mais classes(Entidades, nesse caso foi usuarios)
    // E vai aplicar os metodos que eu coloquei lá, que foi o de excluir o password e o get avatar_url()
    return response.json({ user: classToClass(user), token });
  }
}
