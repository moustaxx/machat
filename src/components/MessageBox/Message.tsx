import React from 'react';

import styles from './Message.module.css';
import Time from './Time';

interface IMessageProps {
    nickname: string;
    content: string;
    createdAt: string;
}

const Message = ({ nickname, content, createdAt }: IMessageProps) => {
    return (
        <div className={styles.root}>
            <div className={styles.avatar}>{nickname[0]}</div>
            <div className={styles.container}>
                <div className={styles.firstRow}>
                    <div className={styles.nickname}>{nickname}</div>
                    <Time
                        time={createdAt}
                        className={styles.createdAt}
                    />
                </div>
                <div className={styles.content}>{content}</div>
            </div>
        </div>
    );
};

export default Message;
