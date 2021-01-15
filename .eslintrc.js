const reactRules = {
    'jsx-a11y/label-has-associated-control': ['warn', { assert: 'either' }],
    'react/jsx-curly-newline': 0,
    'react/jsx-indent': ['warn', 4],
    'react/jsx-indent-props': ['warn', 4],
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-children-prop': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'react/state-in-constructor': ['warn', 'never'],
};

/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
    },
    ignorePatterns: ['/**/__generated__/*'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/indent': ['warn', 4, { SwitchCase: 1 }],
        '@typescript-eslint/member-delimiter-style': 'warn',
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-unsafe-assignment': 0, // not performant
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
        '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
        '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
        '@typescript-eslint/prefer-optional-chain': 'warn',
        '@typescript-eslint/promise-function-async': 'warn',
        'arrow-body-style': 0,
        'consistent-return': 0,
        'import/no-cycle': 0, // not performant
        'import/prefer-default-export': 0,
        'linebreak-style': ['warn', 'windows'],
        'max-len': ['error', 100, 4, {
            ignoreUrls: true,
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],
        'no-console': 0,
        'no-multiple-empty-lines': ['warn', { max: 3, maxBOF: 0, maxEOF: 1 }],
        'no-param-reassign': ['warn', { props: false }],
        'no-tabs': 0,
        'no-void': ['error', { allowAsStatement: true }],
        'object-curly-newline': ['warn', { consistent: true }],
        ...reactRules,
    },
    overrides: [{
        files: ['**/*.js'],
        rules: {
            'import/no-extraneous-dependencies': 0,
            '@typescript-eslint/ban-ts-comment': 0,
            '@typescript-eslint/no-unsafe-call': 0,
            '@typescript-eslint/no-unsafe-member-access': 0,
            '@typescript-eslint/no-var-requires': 0,
        },
    }],
};
