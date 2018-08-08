module.exports = {
    'extends': [
        'airbnb-base',
        'plugin:jest/recommended',
    ],
    plugins: [
        'jest',
    ],
    'env': {
        'node': true,
        'jest/globals': true,
    },
    'rules': {
        'indent': ['error', 4],
        'curly': ['error', 'all'],
        'no-param-reassign': ['error', { 'props': false }],
        'padding-line-between-statements': [
            'error',
            { 'blankLine': 'always', 'prev': 'if', 'next': '*' },
        ],
        'no-new': 0,
        'no-console': 0,
    },
};
