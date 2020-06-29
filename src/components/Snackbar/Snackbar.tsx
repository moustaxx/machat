import React from 'react';

import styles from './Snackbar.module.css';

type TProps = {
    message: string;
    buttonText?: string;
    buttonOnClick?: () => void;
};

const Snackbar = ({ message, buttonText, buttonOnClick }: TProps) => {
    return (
        <div className={styles.root}>
            {message}
            {buttonText && (
                <button className={styles.btn} type="button" onClick={buttonOnClick}>
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default Snackbar;
