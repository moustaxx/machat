const { DefinePlugin } = require('webpack');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const RelayCompilerWebpackPlugin = require('relay-compiler-webpack-plugin');
const RelayCompilerLanguageTypescript = require('relay-compiler-language-typescript').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const isDev = process.env.NODE_ENV !== 'production';

/**
 * @type {import('webpack').Configuration & {
 *  devServer: import('webpack-dev-server').Configuration
 * }}
*/
const config = {
    target: 'browserslist',
    mode: isDev ? 'development' : 'production',
    entry: {
        app: './src/index.tsx',
    },
    devtool: isDev ? 'eval' : 'source-map',
    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '/',
        ...!isDev && {
            filename: './js/[name].[contenthash].min.js',
            chunkFilename: './js/[name].[contenthash].chunk.js',
        },
    },
    stats: {
        preset: isDev ? 'minimal' : undefined,
        colors: true,
        modules: false,
        assets: false,
    },
    devServer: {
        historyApiFallback: true,
        static: './public',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: /@babel(?:\/|\\{1,2})runtime/,
                test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                use: 'source-map-loader',
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: require.resolve('babel-loader'),
                options: {
                    cacheDirectory: './.yarn/.cache/babel-loader',
                },
            },
            {
                test: /\.css$/i,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: isDev
                                    ? '[name]__[local]'
                                    : '[hash:base64]',
                                mode: (resourcePath) => {
                                    if (/module.css$/i.test(resourcePath)) {
                                        return 'local';
                                    }
                                    return 'global';
                                },
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|mp3|wav)$/i,
                loader: 'file-loader',
                options: {
                    name: 'media/[name].[hash:8].[ext]',
                },
            },
        ],
    },
    plugins: [
        isDev && new ReactRefreshWebpackPlugin(),
        new RelayCompilerWebpackPlugin({
            schema: path.resolve(__dirname, './schema.graphql'),
            src: path.resolve(__dirname, './src'),
            languagePlugin: RelayCompilerLanguageTypescript,
            config: {
                noFutureProofEnums: true,
            },
        }),
        !isDev && new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        !isDev && new CopyWebpackPlugin({
            patterns: [
                {
                    from: './public/',
                    globOptions: {
                        ignore: '**/*index.html',
                    },
                },
            ],
        }),
        !isDev && new WorkboxWebpackPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
    ].filter(Boolean),
};

module.exports = config;
