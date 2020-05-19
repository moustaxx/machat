import React from 'react';
import clsx from 'clsx';

import styles from './Skeleton.module.css';

type TProps = {
    className?: string;
    width?: string | number;
    maxWidth?: string | number;
    height?: string | number;
    text?: boolean;
};

const Skeleton: React.FC<TProps> = ({
    className,
    width,
    maxWidth,
    height,
    text,
}) => {
    return (
        <div
            className={clsx(className, styles.animate, text && styles.text)}
            style={{ width, height, maxWidth }}
        />
    );
};

export default Skeleton;
