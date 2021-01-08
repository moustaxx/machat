import React from 'react';
import clsx from 'clsx';

import styles from './Switch.module.css';

type TProps = {
    isActive: boolean;
    className?: string;
};

const Switch = ({ isActive, className }: TProps) => {
    return (
        <div
            className={clsx(styles.root, isActive && styles.active, className)}
        >
            <div className={styles.ball} />
        </div>
    );
};

export default Switch;
