/* eslint-disable no-unused-expressions, global-require, no-use-before-define, no-param-reassign */
const yargs = require('yargs');
const flow = require('lodash.flow');
const path = require('path');

const BIN_NAME = 'app';

const parser = yargs
    .usage(`\nUsage: ${BIN_NAME} [command] [options]`)
    .command({
        command: 'start',
        desc: 'Start worker',
        builder: flow(cmdStart, optionsRedis, optionsWorker),
        handler: argv => require('./lib/commands/worker')(argv),
    })
    .command({
        command: 'get-errors',
        desc: 'Get errors',
        builder: flow(optionsRedis, optionsGetErrors),
        handler: argv => require('./lib/commands/getErrors')(argv),
    })
    .demandCommand(1)
    .option('env', {
        coerce: (arg) => {
            if (arg === true) {
                require('dotenv').config();
            } else {
                require('dotenv').config({ path: path.resolve(arg) });
            }
            return arg;
        },
    })
    .help();

parser.getOptions().boolean.splice(-2);
parser.argv;

function cmdStart(_yargs) {
    return _yargs
        .usage(`\nUsage: ${BIN_NAME} start [options]`);
}

function optionsRedis(_yargs) {
    return _yargs
        .config(pickEnv({
            REDIS_HOST: 'host',
            REDIS_PORT: 'port',
            REDIS_PASS: 'pass',
            REDIS_DB: 'db',
        }))
        .option('host', {
            alias: 'h',
            describe: 'redis host',
            default: 'localhost',
            description: 'dgsdgsdg',
        })
        .option('port', {
            alias: 'p',
            describe: 'redis port',
            coerce: v => Number(v),
            default: 6379,
        })
        .option('pass', {
            describe: 'redis password',
            default: '',
        })
        .option('db', {
            describe: 'redis db',
            coerce: v => Number(v),
            default: 0,
        });
}

function optionsWorker(_yargs) {
    return _yargs
        .option('concurrency', {
            describe: 'worker concurrency',
            coerce: v => Number(v),
            default: 1,
        });
}

function optionsGetErrors(_yargs) {
    return _yargs
        .option('limit', {
            describe: 'limit',
            coerce: v => Number(v),
            default: 100,
        });
}

function pickEnv(map) {
    return Object.keys(map).reduce((config, name) => {
        if (name in process.env) {
            config[map[name]] = process.env[name];
        }
        return config;
    }, {});
}
