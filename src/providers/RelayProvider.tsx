import {
    FetchFunction,
    GraphQLSingularResponse,
    SubscribeFunction,
    Observable,
    Environment as RelayEnvironment,
    Network,
    Store,
    RecordSource,
} from 'relay-runtime';
import { RelayEnvironmentProvider as EnvironmentProvider } from 'react-relay/hooks';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const fetchFunction: FetchFunction = async (operation, variables) => {
    try {
        const response = await fetch('https://machat-server.herokuapp.com/v1beta1/relay', {
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
            json.errors.map((error) => (
                console.error(
                    `GraphQL Error: ${error.message}\n`,
                    'Details:', { error, operation, variables },
                )
            ));

            throw new Error(json.errors[0]?.message || 'Unknown');
        }

        return json;
    } catch (err) {
        throw new Error(err);
    }
};

const subscriptionClient = new SubscriptionClient(
    'wss://machat-server.herokuapp.com/v1beta1/relay',
    {
        reconnect: true,
        connectionCallback: (error, res) => {
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

export const Environment = new RelayEnvironment({
    network: Network.create(fetchFunction, subscribeFunction),
    store: new Store(new RecordSource(), {
        gcReleaseBufferSize: 10,
    }),
});

const RelayProvider: React.FC = ({ children }) => (
    <EnvironmentProvider environment={Environment}>
        {children}
    </EnvironmentProvider>
);

export default RelayProvider;
