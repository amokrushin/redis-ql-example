module.exports = (params) => {
    const label = params.label || process.pid;
    return ['log', 'info', 'warn', 'error'].reduce((acc, method) => {
        acc[method] = (...args) => console[method](`[${label}]`, ...args);
        return acc;
    }, {});
};
