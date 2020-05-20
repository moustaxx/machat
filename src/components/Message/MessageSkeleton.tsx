import React from 'react';
import clsx from 'clsx';

import styles from './Message.module.css';
import Skeleton from '../Skeleton';

const MessageSkeleton = () => {
    return (
        <div className={styles.root}>
            <Skeleton className={clsx(styles.avatar)} />
            <div className={styles.container}>
                <Skeleton className={clsx(styles.firstRow)} text maxWidth={300} />
                <Skeleton className={clsx(styles.content)} text maxWidth={300} />
            </div>
        </div>
    );
};

export default MessageSkeleton;
