import React from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay/hooks';

import { ConversationDataQuery } from './__generated__/ConversationDataQuery.graphql';
import styles from './Conversation.module.css';
import MessagesInbox from '../MessagesInbox';
import TopBar from '../TopBar';
import MessageInput from '../MessageInput';

const Conversation = () => {
    const data = useLazyLoadQuery<ConversationDataQuery>(
        graphql`
            query ConversationDataQuery {
                ...MessagesInbox_messages
            }
        `,
        {},
    );

    return (
        <div className={styles.root}>
            <TopBar disableRedirectOnLogoClick />
            <MessagesInbox messagesInbox={data} />
            <MessageInput />
        </div>
    );
};

export default Conversation;
