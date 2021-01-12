import { useRef } from 'react';
import { graphql, usePaginationFragment } from 'react-relay/hooks';

import Message from '../Message';

import { MessagesInbox_messages$key } from './__generated__/MessagesInbox_messages.graphql';
// import styles from './MessagesInbox.module.css';
import useMessagesInboxNewMsgSubscription from './useMessagesInboxNewMsgSubscription';
import MessagesInboxScrollHelper from './MessagesInboxScrollHelper';
import useNewMessageNotification from './useNewMessageNotification';

type TProps = {
    messagesInbox: MessagesInbox_messages$key;
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
                        cursor
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
    const lastMessage = messages[messages.length - 1];

    const lastCursor = useRef<string>(lastMessage.cursor);
    lastCursor.current = lastMessage.cursor || lastCursor.current;

    useMessagesInboxNewMsgSubscription(lastCursor.current);
    useNewMessageNotification();

    const handleLoadMoreMsgs = () => loadPrevious(30);

    return (
        <MessagesInboxScrollHelper
            firstItemID={messages[0].node.id}
            lastItemID={lastMessage.node.id}
        >
            <button onClick={handleLoadMoreMsgs} type="button">Load more</button>
            {isLoadingPrevious && <span>isLoadingNext</span>}
            {messages.map(({ node }) => (
                <Message
                    key={node.id}
                    message={node}
                />
            ))}
        </MessagesInboxScrollHelper>
    );
};

export default MessagesInbox;
