import React from 'react';
import clsx from 'clsx';

import styles from './Menu.module.css';

type TProps = {
    menuRef: React.MutableRefObject<any>;
    className?: string;
};

const Menu: React.FC<TProps> = ({ children, className, menuRef }) => {
    return (
        <div className={clsx(styles.root, className)} ref={menuRef}>
            <div className={styles.menuContainer}>
                {children}
            </div>
        </div>
    );
};

export default Menu;
