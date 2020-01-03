import logger from "../util/logger.util";
import {APP_IDENTIFIER, REDIS_PORT} from "../util/secrets.util";
import {RedisClient} from "redis";
import {promisify} from "util";

class RedisService {
  private readonly redisClient: RedisWrapper;

  private constructor() {
    logger.silly(`[${APP_IDENTIFIER}] RedisService`);
    this.redisClient = new RedisClient({port: REDIS_PORT});

    this.redisClient.setAsync = promisify(this.redisClient.set).bind(this.redisClient);
    this.redisClient.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    this.redisClient.listKeysAsync = promisify(this.redisClient.keys).bind(this.redisClient);
    this.redisClient.delAsync = promisify(this.redisClient.del).bind(this.redisClient);
    this.redisClient.flushAsync = promisify(this.redisClient.flushdb).bind(this.redisClient);
  }

  static getInstance(): RedisService {
    return new RedisService();
  }

  public async set(key: string, value: any, timeout: number): Promise<void> {
    const args: any[] = [key, JSON.stringify(value)];
    if (timeout) {
      args.push('PX', timeout);
    }
    return await this.redisClient.setAsync(...args);
  }

  public async get(key: string): Promise<string> {
    const value = await this.redisClient.getAsync(key);
    return JSON.parse(value);
  }

  public async listKeys(pattern: string = "*"): Promise<string[]> {
    return await this.redisClient.listKeysAsync(pattern);
  }

  public async delete(key: string): Promise<void> {
    return await this.redisClient.delAsync(key);
  }

  public async flush(key: string): Promise<void> {
    return await this.redisClient.flushAsync();
  }
}

interface RedisWrapper extends RedisClient {
  setAsync?(...args): Promise<void>;
  getAsync?(key: string): Promise<string>;
  listKeysAsync?(pattern: string): Promise<string[]>;
  delAsync?(key: string): Promise<void>;
  flushAsync?(): Promise<void>;
}

export const redisService = RedisService.getInstance();

