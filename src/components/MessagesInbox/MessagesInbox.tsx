import React, { Suspense } from 'react';
import { graphql, usePaginationFragment } from 'react-relay/hooks';

import Message from '../Message';

import { MessagesInbox_messages$key } from './__generated__/MessagesInbox_messages.graphql';
import styles from './MessagesInbox.module.css';

type TProps = {
    messagesInbox: MessagesInbox_messages$key;
};

const SuspenseTest = () => {
    console.log('SuspenseTest');
    return <div>Test Loading...</div>;
};

const MessagesInbox = ({ messagesInbox }: TProps) => {
    const {
        loadPrevious,
        isLoadingPrevious,
        data,
    } = usePaginationFragment(
        graphql`
            fragment MessagesInbox_messages on query_root
            @argumentDefinitions(
                count: { type: "Int", defaultValue: 30 }
                cursor: { type: "String" }
            )
            @refetchable(queryName: "MessagesFragmentPaginationQuery") {
                messages_connection(
                    last: $count,
                    before: $cursor,
                    order_by: { created_at: asc },
                    where: {
                        conversation_id: {
                            _eq: "b6a9e90f-a668-463c-ae48-32221002116c",
                        }
                    }
                )
                @connection(key: "MessagesFragment__messages_connection") {
                    edges {
                        node {
                            id
                            ...Message_data
                        }
                    }
                }
            }
        `,
        messagesInbox,
    );
    const messages = data.messages_connection.edges;

    const handleLoadMoreMsgs = () => {
        loadPrevious(30);
    };

    return (
        <div className={styles.root}>
            <div className={styles.messagesWrapper}>
                <button onClick={handleLoadMoreMsgs} type="button">Load more</button>
                {isLoadingPrevious && <span>isLoadingNext</span>}
                <Suspense fallback={<SuspenseTest />}>
                    {messages?.map(({ node }) => (
                        <Message
                            key={node.id}
                            message={node}
                        />
                    ))}
                </Suspense>
            </div>
        </div>
    );
};

export default MessagesInbox;
