import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoMarkGithub } from 'react-icons/go';

import styles from './Welcome.module.css';
import Button from '../Button';
import { SettingsContext } from '../../contexts/SettingsContext';

type TProps = {
    setPanel: (name: 'welcome' | 'login' | 'register') => void;
};

const Welcome = ({ setPanel }: TProps) => {
    const navigate = useNavigate();
    const { settings } = useContext(SettingsContext);

    const footer = (
        <div className={styles.footer}>
            Made by&nbsp;
            <a className={styles.link} href="https://github.com/moustaxx">moustaxx</a>
            <br />
            Source code available at&nbsp;&nbsp;
            <a className={styles.link} href="https://github.com/moustaxx/machat">
                <GoMarkGithub className={styles.githubIcon} />
                &nbsp;GitHub
            </a>
        </div>
    );

    return (
        <div className={styles.root}>
            <h1 className={styles.heading}>Welcome to MaChat!</h1>
            <p className={styles.paragraph}>
                MaChat is the place where you can easily comunicate
                with your friends and many more! All for free!
            </p>
            <div className={styles.btnWrapper}>
                {settings.isLoggedIn
                    ? (
                        <Button
                            mode="light"
                            className={styles.btn}
                            onClick={() => navigate('/app')}
                        >Get in
                        </Button>
                    ) : (
                        <>
                            <Button
                                mode="light"
                                className={styles.btn}
                                onClick={() => setPanel('register')}
                            >Sign up
                            </Button>
                            <Button
                                mode="light"
                                className={styles.btn}
                                onClick={() => setPanel('login')}
                            >Log in
                            </Button>
                        </>
                    )
                }
            </div>
            {footer}
        </div>
    );
};

export default Welcome;
