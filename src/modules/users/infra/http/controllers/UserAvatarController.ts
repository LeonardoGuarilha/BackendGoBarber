import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    // console.log(request.file);

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    // O classToClass() via pegar uma ou mais classes(Entidades, nesse caso foi usuarios)
    // E vai aplicar os metodos que eu coloquei lá, que foi o de excluir o password e o get avatar_url()
    return response.json(classToClass(user));
  }
}
