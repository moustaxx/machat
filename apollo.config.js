const path = require('path');
const {
    config,
    directivesFile,
    includesGlobPattern,
} = require('vscode-apollo-relay').generateConfig();

module.exports = {
    client: {
        ...config.client,
        service: {
            ...config.client.service,
            name: 'machat',
            localSchemaFile: './schema.graphql',
        },
        includes: [
            directivesFile,
            path.join('./src', includesGlobPattern(['ts', 'tsx'])),
        ],
    },
};
