import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    // Salva uma informação dentro do redis. Salvo ele sempre convertido para json com o JSON.stringify(value)
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    // Retorno uma informação do redis
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    // Salvo em json, tenho que desconverter para string
    const parsedData = JSON.parse(data) as T; // O JSON.pase sempre retorna any, então eu digo pra ele sempre retornar o tipo que eu passar

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    // Pego todas as chaves que tem esse prefixo
    const keys = await this.client.keys(`${prefix}:*`); // Se eu pasar providers-list ele vai pegar todas as chaves que comecam com providers-list: qualquer

    // Para executar multiplas operações ao mesmo tempo o pipeline é mais performatico
    const pipeline = this.client.pipeline();

    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
