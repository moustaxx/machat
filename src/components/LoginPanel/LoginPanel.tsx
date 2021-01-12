import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './LoginPanel.module.css';
import lightWideButton from '../../sharedCssModules/lightWideButton.module.css';
import { SettingsContext } from '../../contexts/SettingsContext';

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
            <h1 className={styles.heading}>Type your nickname</h1>
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
                className={lightWideButton.root}
            >Log in
            </button>
        </form>
    );
};

export default LoginPanel;
