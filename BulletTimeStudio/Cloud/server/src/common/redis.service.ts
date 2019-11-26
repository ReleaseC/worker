const redis = require('redis');
const bluebird = require("bluebird");
// let config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);
// const client = bluebird.promisifyAll(redis.createClient(config.redisPort,config.redisHost));
const client = bluebird.promisifyAll(redis.createClient());

export class RedisService {
    
    static setCache(key, data){
        client.set(key, data);
    }

    static async getCache(key){
        return await client.getAsync(key);
    }
}