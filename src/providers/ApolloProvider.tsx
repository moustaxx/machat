import React from 'react';
import {
    ApolloProvider as Provider,
    ApolloClient,
    HttpLink,
    InMemoryCache,
    split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/link-ws';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    assumeImmutableResults: true,
    link: split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition'
                && definition.operation === 'subscription'
            );
        },
        new WebSocketLink({
            uri: 'ws://machat-server.herokuapp.com/v1/graphql',
            options: {
                reconnect: true,
                lazy: true,
                reconnectionAttempts: 5,
            },
        }),
        new HttpLink({
            uri: 'https://machat-server.herokuapp.com/v1/graphql',
        }),

    ),
});



const ApolloProvider: React.FC = ({ children }) => (
    <Provider
        client={client}
        children={children}
    />
);

export default ApolloProvider;
