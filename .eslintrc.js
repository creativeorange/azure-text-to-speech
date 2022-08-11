module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'google'
    ],
    'rules': {
        'max-len': ['error', {'code': 125}],
        'indent': ['error', 4],
        'require-jsdoc': ['error', {
            'require': {
                'FunctionDeclaration': false,
                'MethodDefinition': false,
                'ClassDeclaration': false,
                'ArrowFunctionExpression': false,
                'FunctionExpression': false
            }
        }],
    },
    'parserOptions': {
        'sourceType': 'module',
    },
    'parser': '@typescript-eslint/parser',
    "ignorePatterns": ["**/*.html", "**/*.scss"],
}