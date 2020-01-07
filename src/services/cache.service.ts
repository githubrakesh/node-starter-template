import mongoose from "mongoose";
import {redisService} from "./redis.service";
import {Helpers} from "../util/helpers.util";
import logger from "../util/logger.util";

class CacheService {
  private constructor() {}

  static getInstance(): CacheService {
    return new CacheService();
  }

  public enableQueryCaching() {
    this.setupCache(mongoose.Query.prototype);
    this.setupCache(mongoose.Aggregate.prototype);

    this.monkeyPatch(mongoose.Query);
    this.monkeyPatch(mongoose.Aggregate);
  }

  private setupCache(prototype: any): void {
    prototype.cache = function (cache = {}) {
      // ttl is time-to-live for that query in milliseconds
      // explicitly pass null in ttl to not set any ttl on it
      // by default ttl is 1 day
      this._cache = cache && typeof cache === 'object' ? cache : {};
      return this;
    };
  }

  private async monkeyPatch(object: any) {
    const isAggregate = (object == mongoose.Aggregate);
    const exec = object.prototype.exec;

    object.prototype.exec = async function () {
      if (!this._cache) {
        return exec.apply(this, arguments);
      }

      const stage = isAggregate ? this.pipeline() : this.getQuery();
      const collection = isAggregate ? this._model.collection.name : this.mongooseCollection.name;
      const query = JSON.stringify({...stage, collection});

      const cacheValue = await redisService.get(query);
      if (cacheValue) {
        logger.silly("Serving Cached Results");
        if (isAggregate) {
          return cacheValue;
        }
        return Array.isArray(cacheValue) ? cacheValue.map(d => new this.model(d)) : new this.model(cacheValue);
      }

      const result = await exec.apply(this, arguments);
      await CacheService.saveToRedis.call(this, query, result);
      logger.silly("Serving DB Results");

      return result;
    };
  }

  private static async saveToRedis(key: string, value: any): Promise<unknown> {
    const self: any = this;
    const defaultExpiration = 86400000; // one day

    let ttl: any = self._cache.ttl;
    let expiration = self._cache.expireAt;

    if (ttl) {
      if (typeof ttl === "string") {
        ttl = parseInt(ttl);
      }

      return await redisService.set(key, value, ttl);
    }

    if (expiration) {
      if (expiration instanceof Date) {
        expiration = Helpers.epochInMillis(expiration);
      }

      return await redisService.set(key, value, expiration);
    }

    if (self._cache.persist) {
      return await redisService.set(key, value);
    }

    return await redisService.set(key, value, defaultExpiration);
  }
}

export const cacheService = CacheService.getInstance();

