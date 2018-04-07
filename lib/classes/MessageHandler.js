const defaults = require('lodash.defaults');
const assert = require('assert');
const MessageQueue = require('./MessageQueue');
const throwErrorAsync = require('../utils/throwErrorAsync');

const inRange = (number, min, max) => (number >= min && number <= max);
const delay = (timeout = 0) => new Promise(resolve => setTimeout(resolve, timeout));

class MessageHandler extends MessageQueue {
    constructor(createClient, options) {
        const defaultOptions = {
            errorRate: 0,
            ackDelay: 0,
            nackDelay: 0,
        };
        super(createClient, defaults(options, defaultOptions));
        assert(inRange(this._options.errorRate, 0, 1), 'errorRate must be in range [0,1]');
    }

    async _next() {
        if (!this._isRunning) {
            return false;
        }

        const message = await this._queue.dequeue();

        if (!message) {
            return false;
        }

        const { id, payload, ack, nack } = message;
        const { errorRate, ackDelayMs, nackDelayMs } = this._options;

        this.logger.info(`received message [${id}]`, payload);

        if (Math.random() >= errorRate) {
            if (ackDelayMs) await delay(ackDelayMs);
            this.logger.info(`ack [${id}]`);
            ack();
        } else {
            if (nackDelayMs) await delay(nackDelayMs);
            this.logger.info(`nack [${id}]`);
            nack();
        }

        this._next().catch(throwErrorAsync);

        return true;
    }
}

module.exports = MessageHandler;
