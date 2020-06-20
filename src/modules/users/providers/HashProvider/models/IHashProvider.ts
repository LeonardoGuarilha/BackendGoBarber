export default interface IHashProvider {
  // quais metodos um provedor de hash precisa ter
  // Esses metodos são basicamente o que o bcrypt faz, mas eu isolo isso da minha aplicação
  // Para não ficar usando a mesma regra de negócio em vários lugares da minha aplicação e não ferir o DRY(Don`t repeat yourself)

  // Esse payload é uma informação qualquer
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}
