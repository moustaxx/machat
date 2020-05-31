import React, { useContext, useState, useRef } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { GoMarkGithub } from 'react-icons/go';

import styles from './IndexScreen.module.css';
import logo from './chat-icon-white.png';
import people from './people.png';
import { SettingsContext } from '../../contexts/SettingsContext';

const IndexScreen = () => {
    const navigate = useNavigate();
    const { settings, setSettings } = useContext(SettingsContext);
    const [isLoginPanelShown, showLoginPanel] = useState(false);
    const nicknameRef = useRef<HTMLInputElement>(null);

    const handleClickGetIn = () => {
        if (settings.nickname) navigate('/app');
        showLoginPanel(true);
    };

    const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nickname = nicknameRef.current?.value;
        if (!nickname || nickname.length < 4) return;
        setSettings({ nickname });
        navigate('/app');
    };

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
            <div className={styles.container}>
                <div className={clsx(styles.split, styles.splitColorized)}>
                    <img className={styles.logo} src={logo} alt="Logo" />
                    {isLoginPanelShown
                        ? (
                            <form className={styles.splitsContent} onSubmit={handleLoginSubmit}>
                                <h1 className={styles.welcome}>Type your nickname</h1>
                                <input
                                    className={styles.textBox}
                                    ref={nicknameRef}
                                    minLength={4}
                                    maxLength={20}
                                    required
                                    placeholder="Your nickname here..."
                                />
                                <button
                                    type="submit"
                                    className={styles.btn}
                                >Log in
                                </button>
                            </form>
                        )
                        : (
                            <div className={styles.splitsContent}>
                                <h1 className={styles.welcome}>Welcome to MaChat!</h1>
                                <p className={styles.paragraph}>
                                    MaChat is the place where you can easily comunicate
                                    with your friends and many more! All for free!
                                </p>
                                <button
                                    type="button"
                                    className={styles.btn}
                                    onClick={handleClickGetIn}
                                >Get in
                                </button>
                                {footer}
                            </div>
                        )
                    }
                </div>
                <div className={styles.split}>
                    <img className={styles.people} src={people} alt="people" />
                </div>
            </div>
        </div>
    );
};

export default IndexScreen;
