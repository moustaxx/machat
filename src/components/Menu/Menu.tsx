import React from 'react';
import clsx from 'clsx';

import styles from './Menu.module.css';

type TProps = {
    dropDownRef: React.MutableRefObject<any>;
    className?: string;
};

const Menu: React.FC<TProps> = ({ children, className, dropDownRef }) => {
    return (
        <div className={clsx(styles.root, className)} ref={dropDownRef}>
            <div className={styles.dropDownContainer}>
                {children}
            </div>
        </div>
    );
};

export default Menu;
