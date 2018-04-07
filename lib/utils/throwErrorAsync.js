/*
 * UnhandledPromiseRejectionWarning is not a desired behavior
 */
function throwErrorAsync(err) {
    process.nextTick(() => {
        throw err;
    });
}

module.exports = throwErrorAsync;
