import React, { useRef, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { BaseEmoji } from 'emoji-mart';
import TextareaAutosize from 'react-textarea-autosize';
import { MdSend } from 'react-icons/md';

import styles from './MessageInput.module.css';
import { SettingsContext } from '../../contexts/SettingsContext';
import EmojiPicker from '../EmojiPicker';

const sendMessageMutation = gql`
    mutation MessageInput_newMessage($content: String! $nickname: String!) {
        insert_messages_one(
            object: {
                conversation_id: "b6a9e90f-a668-463c-ae48-32221002116c"
                nickname: $nickname
                content: $content
            }
        ) {
            id
            created_at
            nickname
            conversation_id
            content
        }
    }
`;

const MessageInput = () => {
    const textboxRef = useRef<HTMLTextAreaElement>(null);
    const [sendMessage] = useMutation(sendMessageMutation, {
        ignoreResults: true,
    });
    const { nickname } = useContext(SettingsContext).settings;
    const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) event.preventDefault();
        if (!textboxRef.current) return;

        sendMessage({
            variables: {
                content: textboxRef.current.value,
                nickname,
            },
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
                onKeyDown={handleKeyDown}
                className={styles.textbox}
            />
            <EmojiPicker addEmoji={addEmoji} />
        </form>
    );
};

export default MessageInput;
