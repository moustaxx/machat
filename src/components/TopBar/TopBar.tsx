import React from 'react';
import { Link } from 'react-router-dom';

import styles from './TopBar.module.css';

const TopBar = () => {
    return (
        <div className={styles.root}>
            <Link to="/" className={styles.link}>MaChat</Link>
        </div>
    );
};

export default TopBar;
