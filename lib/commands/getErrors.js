const Redis = require('ioredis');
const RedisQueue = require('@amokrushin/redis-queue');


module.exports = function getErrors(params) {
    const redisUrl = `redis://:${params.pass}@${params.host}:${params.port}/${params.db}`;

    const createClient = () => {
        const redis = new Redis(redisUrl);
        redis.once('error', (err) => {
            throw new Error(err);
        });
        return redis;
    };

    const redisQueue = new RedisQueue(createClient);

    redisQueue
        .getNackedItems({ limit: params.limit })
        .then((erroredMessages) => {
            erroredMessages.forEach((message) => {
                console.dir(message, { depth: 6, colors: true });
            });
        });
};
