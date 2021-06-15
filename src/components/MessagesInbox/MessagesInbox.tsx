import { useRef } from 'react';
import { graphql, usePaginationFragment } from 'react-relay/hooks';
import InView from 'react-intersection-observer';

import Message from '../Message';

import { MessagesInbox_messages$key } from './__generated__/MessagesInbox_messages.graphql';
import styles from './MessagesInbox.module.css';
import MessagesInboxScrollHelper from './MessagesInboxScrollHelper';
import MessageSkeleton from '../Message/MessageSkeleton';
// import useMessagesInboxNewMsgSubscription from './useMessagesInboxNewMsgSubscription';
// import useNewMessageNotification from './useNewMessageNotification';

type TProps = {
    messagesInbox: MessagesInbox_messages$key;
};

const MessagesInbox = ({ messagesInbox }: TProps) => {
    const messageBoxRef = useRef<HTMLDivElement | null>(null);
    const {
        loadPrevious,
        data,
    } = usePaginationFragment(
        graphql`
            fragment MessagesInbox_messages on ConversationType
                @argumentDefinitions(
                    count: { type: "Int", defaultValue: 30 }
                    cursor: { type: "String" }
                )
                @refetchable(queryName: "MessagesFragmentPaginationQuery")
            {
                messages(
                    last: $count,
                    before: $cursor,
                )
                @connection(key: "MessagesFragment__messages") {
                    edges {
                        cursor
                        node {
                            id
                           ...Message_data
                        }
                    }
                    totalCount
                }
            }
        `,
        messagesInbox,
    );
    const messages = data.messages.edges;

    if (!messages || !messages.length) {
        return (
            <h1 className={styles.noMessages}>No messages to show...</h1>
        );
    }

    const lastMessage = messages[messages.length - 1]!;

    // const lastCursor = useRef<string>(lastMessage.cursor);
    // lastCursor.current = lastMessage.cursor || lastCursor.current;

    // useMessagesInboxNewMsgSubscription(lastCursor.current);
    // useNewMessageNotification();

    const handleLoadMoreMsgs = () => loadPrevious(30);

    return (
        <>
            <MessagesInboxScrollHelper
                firstItemID={messages[0]!.node.id}
                lastItemID={lastMessage.node.id}
                messageBoxRef={messageBoxRef}
            >
                {!(messages.length >= data.messages.totalCount) && (
                    <InView
                        as="div"
                        root={messageBoxRef.current}
                        rootMargin="400px"
                        onChange={(inView) => inView && handleLoadMoreMsgs()}
                    >
                        <MessageSkeleton />
                        <MessageSkeleton />
                        <MessageSkeleton />
                    </InView>
                )}
                {messages.map((msg) => (
                    <Message
                        key={msg!.node.id}
                        message={msg!.node}
                    />
                ))}
            </MessagesInboxScrollHelper>
        </>
    );
};

export default MessagesInbox;
