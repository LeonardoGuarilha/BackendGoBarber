export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  // O recover recebe um argumento de tipo e ele vai retornar esse T que eu passei por parametro ou nulo
  recover<T>(key: string): Promise<T | null>;
  // invalidar é a mesma coisa que deletar
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
