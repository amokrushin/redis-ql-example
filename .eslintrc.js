module.exports = {
    extends: 'airbnb-base',
    rules: {
        'arrow-parens': ['off'],
        'import/extensions': ['off', { "js": "never", "json": "always" }],
        "import/no-extraneous-dependencies": ["off", { "devDependencies": true }],
        /* Do not ensure an imported module can be resolved to a module on the local filesystem */
        'import/no-unresolved': 'off',
        /* Set 2-space indentation, opposite of default 2 */
        'indent': ['error', 4, {
            /* Enforce indentation level for case clauses in switch statements */
            'SwitchCase': 1,
        }],
        'func-names': ['off'],
        'max-len': ['error', { 'code': 120 }],
        'no-console': ['off'],
        'no-else-return': ['off'],
        /* Allow unary operators ++ and -- */
        'no-plusplus': ['off'],
        'no-template-curly-in-string': ['off'],
        /* Allow dangling underscores in identifiers */
        'no-underscore-dangle': ['off'],
        'object-curly-newline': ['error', {
            ObjectExpression: { consistent: true },
            ObjectPattern: { consistent: true },
        }],
        'prefer-arrow-callback': ['error', {
            allowNamedFunctions: true,
            allowUnboundThis: true,
        }],
        'strict': ['off'],
    },
    env: {
        node: true,
    },
    root: true,
};
