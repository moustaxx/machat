import React from 'react';
import { useNavigate } from 'react-router';

import styles from './PageNotFound.module.css';

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.root}>
            <div className={styles.errorID}>Error 404</div>
            <div className={styles.pageNotFoundText}>Page not found</div>
            <div className={styles.buttonsContainer}>
                <button
                    className={styles.btn}
                    onClick={() => navigate(-1)}
                    aria-label="Go back to recent page"
                    type="button"
                    children="Go back"
                />
                <button
                    className={styles.btn}
                    onClick={() => navigate('/')}
                    aria-label="Go to homepage"
                    type="button"
                    children="Go to homepage"
                />
            </div>
        </div>
    );
};

export default PageNotFound;
