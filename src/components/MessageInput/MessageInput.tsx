import React, { useRef, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';

import styles from './MessageInput.module.css';
import { SettingsContext } from '../../contexts/SettingsContext';

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
    const inputRef = useRef<HTMLInputElement>(null);
    const [sendMessage] = useMutation(sendMessageMutation, {
        ignoreResults: true,
    });
    const { nickname } = useContext(SettingsContext).settings;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!inputRef.current) return;

        sendMessage({
            variables: {
                content: inputRef.current.value,
                nickname,
            },
        });
        inputRef.current.value = '';
    };

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <svg
                    className={styles.icon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message here..."
                        className={styles.input}
                    />
                </form>
            </div>
        </div>
    );
};

export default MessageInput;
