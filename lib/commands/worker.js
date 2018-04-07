const RedisLeader = require('@amokrushin/redis-leader');
const Redis = require('ioredis');
const os = require('os');
const MessageGenerator = require('../classes/MessageGenerator');
const MessageHandler = require('../classes/MessageHandler');
const createLogger = require('../utils/createLogger');

module.exports = function worker(params) {
    const redisUrl = `redis://:${params.pass}@${params.host}:${params.port}/${params.db}`;

    const logger = createLogger({
        label: os.hostname(),
    });

    const clientsByRef = new Map();
    const createClient = ({ ref } = {}) => {
        if (ref && clientsByRef.has(ref)) {
            return clientsByRef.get(ref);
        }
        const redis = new Redis(redisUrl);
        redis.once('error', (err) => {
            throw new Error(err);
        });
        if (ref) {
            clientsByRef.set(ref, redis);
        }
        return redis;
    };

    const node = new RedisLeader(createClient, {
        failoverTimeout: 1000,
    });

    let generator;
    let handlers = [];

    node.on('switch-role', () => {
        const isLeader = node.isLeader();
        logger.info(`switch role is_leader=${isLeader}`);

        if (generator) {
            generator.stop();
            generator = null;
        }

        if (handlers.length) {
            handlers.forEach((handler) => {
                handler.stop();
            });
            handlers = null;
        }

        if (isLeader === true) {
            generator = new MessageGenerator(createClient, {
                logger,
                delayMs: 500,
            });
        }

        if (isLeader === false) {
            const concurrency = params.concurrency || 1;

            handlers = Array.from({ length: concurrency }).map(() => new MessageHandler(
                createClient,
                {
                    logger,
                    errorRate: 0.05,
                    // ackDelayMs: 100,
                },
            ));
        }
    });
};
