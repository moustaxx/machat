const pkg = require('./package.json');

module.exports = (api) => {
    api.cache.using(() => process.env.NODE_ENV); // This caches the Babel config
    const isDev = !api.env('production');

    return {
        plugins: [
            isDev && 'react-refresh/babel',
            [
                '@babel/plugin-transform-runtime',
                {
                    "version": pkg.dependencies['@babel/runtime'],
                }
            ],
            '@babel/plugin-proposal-class-properties',
            'relay',
        ].filter(Boolean),
        presets: [
            [
                '@babel/preset-env',
                {
                    bugfixes: true, // TODO: Remove after babel 8 update
                },
            ],
            ['@babel/preset-react', { 'runtime': 'automatic' }],
            '@babel/preset-typescript',
        ],
    };
};
