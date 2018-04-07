const defaults = require('lodash.defaults');
const loremIpsum = require('lorem-ipsum');
const MessageQueue = require('./MessageQueue');
const delay = require('../utils/delay');
const throwErrorAsync = require('../utils/throwErrorAsync');

class MessageGenerator extends MessageQueue {
    constructor(createClient, options) {
        const defaultOptions = {
            delayMs: 500,
        };
        super(createClient, defaults(options, defaultOptions));
    }

    async _next() {
        if (!this._isRunning) {
            return false;
        }

        const { delayMs } = this._options;
        const message = { text: loremIpsum({ count: 3, units: 'words' }) };

        this.logger.info('enqueue', message);

        await this._queue.enqueue(message);
        await delay(delayMs);

        this._next().catch(throwErrorAsync);

        return true;
    }
}

module.exports = MessageGenerator;
