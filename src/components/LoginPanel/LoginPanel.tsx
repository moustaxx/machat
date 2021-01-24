import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './LoginPanel.module.css';
import Button from '../Button';

const LoginPanel = () => {
    const navigate = useNavigate();
    const { setSettings } = useContext(SettingsContext);
    const nicknameRef = useRef<HTMLInputElement>(null);

    const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nickname = nicknameRef.current?.value;
        if (!nickname || nickname.length < 4 || nickname.length > 20) return;
        setSettings({ nickname });
        navigate('/app');
    };

    return (
        <form className={styles.root} onSubmit={handleLoginSubmit}>
            <h1 className={styles.heading}>Log in</h1>
            <TextBox
                ref={usernameRef}
                minLength={4}
                maxLength={20}
                required
                placeholder="Username"
            />
            <TextBox
                ref={passwordRef}
                minLength={6}
                required
                type="password"
                placeholder="Password"
            />
            <div className={styles.btnWrapper}>
                <Button
                    mode="light"
                    className={styles.btn}
                >Go back
                </Button>
                <Button
                type="submit"
                    mode="light"
                    className={styles.btn}
            >Log in
                </Button>
            </div>
        </form>
    );
};

export default LoginPanel;
