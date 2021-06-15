import { useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, graphql } from 'react-relay/hooks';
import { BaseEmoji } from 'emoji-mart';
import TextareaAutosize from 'react-textarea-autosize';
import { MdSend } from 'react-icons/md';
import clsx from 'clsx';
import { ConnectionHandler, SelectorStoreUpdater } from 'relay-runtime';

import styles from './MessageInput.module.css';
import { SettingsContext } from '../../contexts/SettingsContext';
import { toGlobalId } from '../../utils/globalId';
import EmojiPicker from '../EmojiPicker';
import {
    MessageInputMutation,
    MessageInputMutationResponse,
} from './__generated__/MessageInputMutation.graphql';


type TProps = {
    onFocus?: () => void;
    onBlur?: () => void;
};

const MessageInput = ({ onFocus, onBlur }: TProps) => {
    const { settings } = useContext(SettingsContext);
    const textboxRef = useRef<HTMLTextAreaElement>(null);
    const conversationID = Number(useParams().conversationID) || null;

    const [sendMessage, isSending] = useMutation<MessageInputMutation>(graphql`
        mutation MessageInputMutation(
            $conversationID: Int!
            $content: String!
        ) @raw_response_type { # use raw type to generate ts types
            createMessage(
                conversationId: $conversationID
                    content: $content
            ) {
                ...Message_data
            }
        }
    `);

    const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) event.preventDefault();
        if (!textboxRef.current || isSending || !conversationID || !settings.userData) return;
        const content = textboxRef.current.value;

        const updater: SelectorStoreUpdater<MessageInputMutationResponse> = (store) => {
            const conversation = store.get(toGlobalId('ConversationType', conversationID));
            if (!conversation) return;

            const connectionRecord = ConnectionHandler.getConnection(
                conversation,
                'MessagesFragment__messages',
            );
            if (!connectionRecord) return;

            const payload = store.getRootField('createMessage');
            const newEdge = ConnectionHandler.createEdge(
                store,
                connectionRecord,
                payload,
                'messagesEdge',
            );
            ConnectionHandler.insertEdgeAfter(connectionRecord, newEdge);
        };

        sendMessage({
            variables: { content, conversationID },
            optimisticResponse: {
                createMessage: {
                    id: new Date().toISOString(),
                    createdAt: 'OPTIMISTIC',
                    content,
                    author: {
                        id: settings.userData.id,
                        username: settings.userData.username,
                    },
                },
            },
            optimisticUpdater: updater,
            updater,
        });
        textboxRef.current.form?.reset();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const { current } = textboxRef;
        if (!current || event.key !== 'Enter' || event.shiftKey) return;
        event.preventDefault();
        if (current.value.length) handleSubmit();
    };

    const addEmoji = (emoji: BaseEmoji) => {
        if (!textboxRef.current) return;
        const textbox = textboxRef.current;
        const { selectionStart, selectionEnd, value } = textbox;
        textbox.focus();
        textbox.value = value.substring(0, selectionStart)
            + emoji.native
            + value.substring(selectionEnd, value.length);
        textbox.selectionStart = selectionEnd + emoji.native.length;
        textbox.selectionEnd = selectionEnd + emoji.native.length;
        textbox.focus();
    };

    return (
        <form className={styles.root} onSubmit={handleSubmit}>
            <MdSend className={styles.icon} size={24} aria-hidden />
            <TextareaAutosize
                placeholder="Type your message here..."
                minRows={1}
                maxRows={6}
                ref={textboxRef}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                className={clsx(styles.textbox, isSending && styles.textboxSending)}
            />
            <EmojiPicker addEmoji={addEmoji} />
        </form>
    );
};

export default MessageInput;
