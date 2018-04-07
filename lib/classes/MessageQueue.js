const RedisQueue = require('@amokrushin/redis-queue');
const assert = require('assert');
const defaults = require('lodash.defaults');
const throwErrorAsync = require('../utils/throwErrorAsync');
const noop = require('../utils/noop');

const { NM_BLOCKING } = RedisQueue.notificationsModes;

class MessageQueue {
    constructor(createClient, options) {
        assert.equal(
            typeof createClient,
            'function',
            'createClient argument must be a function',
        );

        this._options = defaults(
            options,
            this.constructor.defaultOptions,
        );

        this._queue = new RedisQueue(
            createClient,
            {
                pubsubChannel: this._options.pubsubChannel,
                notificationsMode: NM_BLOCKING,
            },
        );

        this._isRunning = false;

        this.start();
    }

    start() {
        if (this._isRunning) {
            return false;
        }
        this._isRunning = true;
        this._next().catch(throwErrorAsync);
        return true;
    }

    stop() {
        if (!this._isRunning) {
            return false;
        }
        this._isRunning = false;
        this._queue.cancel();
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    _next() {
        throw new Error('_next not implemented');
    }

    get logger() {
        return this._options.logger;
    }
}

MessageQueue.defaultOptions = {
    pubsubChannel: '__dummy-redis_pubsub__',
    logger: { info: noop },
};

module.exports = MessageQueue;
