import React, { memo } from 'react';
import emoji from 'react-easy-emoji';

import styles from './Message.module.css';
import Time from '../Time';

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
                <div className={styles.content}>{emoji(content, {
                    baseUrl: 'https://twemoji.maxcdn.com/2/svg/',
                    ext: '.svg',
                    size: '',
                })}
                </div>
            </div>
        </div>
    );
};

export default memo(Message);
