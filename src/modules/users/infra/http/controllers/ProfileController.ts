// Crio esse controller para alterar os dados do usuário.
// Mas é do usuário logado, por isso eu não coloquei esse método no UsersController
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    // Pega o id do usuário logado
    const user_id = request.user.id;

    const showProfileService = container.resolve(ShowProfileService);

    const user = await showProfileService.execute({
      user_id,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    // Pega o id do usuário logado
    const user_id = request.user.id;

    const { name, email, old_password, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    // O classToClass() via pegar uma ou mais classes(Entidades, nesse caso foi usuarios)
    // E vai aplicar os metodos que eu coloquei lá, que foi o de excluir o password e o get avatar_url()
    return response.json(classToClass(user));
  }
}
