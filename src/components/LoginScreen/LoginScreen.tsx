import React, { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './LoginScreen.module.css';
import { SettingsContext } from '../../contexts/SettingsContext';

const LoginScreen = () => {
    const nicknameRef = useRef<HTMLInputElement>(null);
    const { setSettings } = useContext(SettingsContext);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nickname = nicknameRef.current?.value;
        if (!nickname || nickname.length < 4) return;
        setSettings({ nickname });
        navigate('/');
    };

    return (
        <div className={styles.root}>
            <form className={styles.loginBox} onSubmit={handleSubmit}>
                <span className={styles.heading}>Please type your nickname</span>
                <label className={styles.label} htmlFor="nickname">Nickname</label>
                <input
                    className={styles.textBox}
                    ref={nicknameRef}
                    id="nickname"
                    type="text"
                    minLength={4}
                    required
                />
                <button className={styles.btn} type="submit">Confirm</button>
            </form>
        </div>
    );
};

export default LoginScreen;
