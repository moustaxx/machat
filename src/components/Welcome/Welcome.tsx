import { GoMarkGithub } from 'react-icons/go';

import styles from './Welcome.module.css';
import Button from '../Button';

type TProps = {
    handleClickGetIn: () => void;
};

const Welcome = ({ handleClickGetIn }: TProps) => {
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
                <Button
                    mode="light"
                    className={styles.btn}
                >Sign up
                </Button>
                <Button
                    mode="light"
                    className={styles.btn}
                >Log in
                </Button>
            </div>
            {footer}
        </div>
    );
};

export default Welcome;
