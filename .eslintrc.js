/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ['eslint-config-airbnb-typescript'],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
    },
    ignorePatterns: ['/**/__generated__/*'],
    rules: {
        '@typescript-eslint/indent': ['warn', 4, { SwitchCase: 1 }],
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'arrow-body-style': 0,
        'consistent-return': 0,
        'jsx-a11y/label-has-associated-control': ['warn', { assert: 'either' }],
        'linebreak-style': ['warn', 'windows'],
        'no-alert': 0,
        'no-console': 0,
        'no-multiple-empty-lines': ['warn', { max: 3, maxBOF: 0, maxEOF: 1 }],
        'no-param-reassign': ['warn', { props: false }],
        'no-tabs': 0,
        'object-curly-newline': ['warn', { consistent: true }],
        'react/jsx-curly-newline': 0,
        'react/jsx-indent': ['warn', 4],
        'react/jsx-indent-props': ['warn', 4],
        'react/jsx-one-expression-per-line': 0,
        'react/jsx-props-no-spreading': 0,
        'react/no-children-prop': 0,
        'react/prop-types': 0,
        'react/require-default-props': 0,
    },
    overrides: [{
        files: ['**/*.js'],
        rules: {
            'import/no-extraneous-dependencies': 0,
            '@typescript-eslint/no-var-requires': 0,
        },
    }],
};
