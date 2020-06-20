// Para a injeção de dependencia, ele vai fazer a mesma coisa que o index.ts do container da pasta @shared faz
// Mas esse é somente para as coisas específicas dos usuários

import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/Implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>(
  // Sempre que tiver uma injeção de dependencia com o nome HashProvider, eu vou retornar uma instancia da classe BCryptHashProvider
  'HashProvider',
  BCryptHashProvider
);
