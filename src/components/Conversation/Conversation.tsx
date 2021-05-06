import { useLazyLoadQuery, graphql } from 'react-relay/hooks';

import { ConversationQuery } from './__generated__/ConversationQuery.graphql';
import styles from './Conversation.module.css';
import MessagesInbox from '../MessagesInbox';
import MessageInput from '../MessageInput';

type TProps = {
    conversationID: number;
};

const Conversation = ({ conversationID }: TProps) => {
    const data = useLazyLoadQuery<ConversationQuery>(
        graphql`
            query ConversationQuery($conversationID: Int!) {
                conversation(whereId: $conversationID) {
                    ...MessagesInbox_messages
                }
            }
        `,
        { conversationID },
    );
    return (
        <div className={styles.root}>
            <MessagesInbox messagesInbox={data.conversation} />
            <MessageInput />
        </div>
    );
};

export default Conversation;
