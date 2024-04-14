import {
    FetchFunction,
    GraphQLSingularResponse,
    SubscribeFunction,
    Observable,
    Environment,
    Network,
    Store,
    RecordSource,
    PayloadError,
} from 'relay-runtime';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const isProduction = process.env.NODE_ENV === 'production';

class NamedError extends Error {
    code!: string;

    constructor(message: string, name: string) {
        super();
        this.message = message;
        this.name = `${name}`;
    }
}

const fetchFunction: FetchFunction = async (operation, variables) => {
    const response = await fetch(isProduction
        ? 'https://machat-server.onrender.com/graphql'
        : 'http://localhost:4000/graphql', {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    });

    // Use GraphQLSingularResponse instead of GraphQLResponse
    // because we are not using request batching
    const json = await response.json() as GraphQLSingularResponse;

    if ('errors' in json && Array.isArray(json.errors)) {
        json.errors.forEach((error) => (
            console.error(
                `GraphQL Error: ${error.message}\n`,
                'Details:', { error, operation, variables },
            )
        ));

        const err = json.errors[0] as PayloadError & { extensions?: { code: string } };
        throw new NamedError(err.message || 'Unknown', err.extensions?.code || 'Error');
    }

    return json;
};

const subscriptionClient = new SubscriptionClient(
    isProduction ? 'wss://machat-prisma.herokuapp.com/graphql' : 'ws://localhost:4000/graphql',
    {
        // lazy: true, // set to true when not logged in
        reconnect: true,
        connectionCallback: (error: Error[] | undefined, res) => {
            if (!error) return;
            console.error('WebSocket Error:', error, res);
        },
    },
);

const subscribeFunction: SubscribeFunction = (request, variables) => {
    return Observable.create((sink) => {
        const subscription = subscriptionClient
            .request({
                operationName: request.name,
                query: request.text || undefined,
                variables,
            })
            .subscribe(sink as any);

        return () => subscription.unsubscribe();
    });
};

export const environment = new Environment({
    network: Network.create(fetchFunction, subscribeFunction),
    store: new Store(new RecordSource()),
});

const RelayProvider: React.FC = ({ children }) => (
    <RelayEnvironmentProvider environment={environment}>
        {children}
    </RelayEnvironmentProvider>
);

export default RelayProvider;
