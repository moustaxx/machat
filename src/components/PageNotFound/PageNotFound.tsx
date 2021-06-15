import { useNavigate } from 'react-router-dom';

import styles from './PageNotFound.module.css';
import TopBar from '../TopBar';
import Button from '../Button';

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.root}>
            <TopBar />
            <div className={styles.container}>
                <div className={styles.errorID}>Error 404</div>
                <div className={styles.pageNotFoundText}>Page not found</div>
                <div className={styles.buttonsContainer}>
                    <Button
                        onClick={() => navigate(-1)}
                        aria-label="Go back to recent page"
                        type="submit"
                        mode="colored"
                        children="Go back"
                        className={styles.btn}
                    />
                    <Button
                        onClick={() => navigate('/')}
                        aria-label="Go to homepage"
                        type="submit"
                        mode="light"
                        children="Go to homepage"
                        className={styles.btn}
                    />
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
