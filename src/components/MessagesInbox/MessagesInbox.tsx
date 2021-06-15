import { graphql, usePaginationFragment } from 'react-relay/hooks';

import Message from '../Message';

import { MessagesInbox_messages$key } from './__generated__/MessagesInbox_messages.graphql';
import styles from './MessagesInbox.module.css';
import MessagesInboxScrollHelper from './MessagesInboxScrollHelper';
// import useMessagesInboxNewMsgSubscription from './useMessagesInboxNewMsgSubscription';
// import useNewMessageNotification from './useNewMessageNotification';

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
            >
                <button onClick={handleLoadMoreMsgs} type="button">Load more</button>
                {isLoadingPrevious && <span>isLoadingNext</span>}
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
