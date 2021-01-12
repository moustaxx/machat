import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import styles from './PageNotFound.module.css';
import TopBar from '../TopBar';

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.root}>
            <TopBar />
            <div className={styles.container}>
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
                        className={clsx(styles.btn, styles.btn2)}
                        onClick={() => navigate('/')}
                        aria-label="Go to homepage"
                        type="button"
                        children="Go to homepage"
                    />
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
