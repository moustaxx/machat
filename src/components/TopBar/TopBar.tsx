import React from 'react';
import { Link } from 'react-router-dom';

import styles from './TopBar.module.css';

type TProps = {
    disableRedirectOnLogoClick?: boolean;
};

const TopBar = ({
    disableRedirectOnLogoClick = false,
}: TProps) => {
    return (
        <div className={styles.root}>
            {disableRedirectOnLogoClick
                ? <span className={styles.link}>MaChat</span>
                : <Link to="/" className={styles.link}>MaChat</Link>
            }
        </div>
    );
};

export default TopBar;
