import React, { useRef, useContext } from 'react';
import { BaseEmoji } from 'emoji-mart';
import TextareaAutosize from 'react-textarea-autosize';
import { MdSend } from 'react-icons/md';
import clsx from 'clsx';
import { useMutation, graphql } from 'react-relay/hooks';
import { ConnectionHandler, SelectorStoreUpdater } from 'relay-runtime';

import styles from './MessageInput.module.css';
import { SettingsContext } from '../../contexts/SettingsContext';
import EmojiPicker from '../EmojiPicker';
import {
    MessageInputMutation,
    MessageInputMutationRawResponse,
} from './__generated__/MessageInputMutation.graphql';


type TProps = {
    onFocus?: () => void;
    onBlur?: () => void;
};

const MessageInput = ({ onFocus, onBlur }: TProps) => {
    const textboxRef = useRef<HTMLTextAreaElement>(null);
    const [sendMessage, isSending] = useMutation<MessageInputMutation>(graphql`
        mutation MessageInputMutation(
            $content: String!
            $nickname: String!
        ) @raw_response_type {
            insert_messages_one(
                object: {
                    conversation_id: "b6a9e90f-a668-463c-ae48-32221002116c"
                    nickname: $nickname
                    content: $content
                }
            ) {
                ...Message_data
            }
        }
    `);
    const { nickname } = useContext(SettingsContext).settings;

    const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) event.preventDefault();
        if (!textboxRef.current || isSending || !nickname) return;
        const content = textboxRef.current.value;

        const updater: SelectorStoreUpdater<MessageInputMutationRawResponse> = (store) => {
            const connectionRecord = ConnectionHandler.getConnection(
                store.getRoot(),
                'MessagesFragment__messages_connection',
                {
                    order_by: { created_at: 'asc' },
                    where: {
                        conversation_id: {
                            _eq: 'b6a9e90f-a668-463c-ae48-32221002116c',
                        },
                    },
                },
            );
            if (!connectionRecord) return;

            const payload = store.getRootField('insert_messages_one');
            const newEdge = ConnectionHandler.createEdge(
                store,
                connectionRecord,
                payload,
                'messagesEdge',
            );
            ConnectionHandler.insertEdgeAfter(connectionRecord, newEdge);
        };

        sendMessage({
            variables: { content, nickname },
            optimisticResponse: {
                insert_messages_one: {
                    id: new Date().toISOString(),
                    createdAt: 'OPTIMISTIC',
                    nickname,
                    content,
                },
            },
            optimisticUpdater: updater as SelectorStoreUpdater<object>,
            updater: updater as SelectorStoreUpdater<object>,
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
