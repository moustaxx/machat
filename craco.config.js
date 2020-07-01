const path = require('path');
const RelayCompilerWebpackPlugin = require('relay-compiler-webpack-plugin');
const RelayCompilerLanguageTypescript = require('relay-compiler-language-typescript').default

module.exports = {
    babel: {
        plugins: [
            'relay',
        ],
    },
    webpack: {
        plugins: [
            new RelayCompilerWebpackPlugin({
                schema: path.resolve(__dirname, './schema.graphql'),
                src: path.resolve(__dirname, './src'),
                languagePlugin: RelayCompilerLanguageTypescript,
                config: {
                    noFutureProofEnums: true,
                },
            }),
        ],
    },
};
