import { useRef, useContext, useState } from 'react';
import { graphql, useMutation } from 'react-relay/hooks';
import { useNavigate } from 'react-router-dom';
import { LoginPanelMutation } from './__generated__/LoginPanelMutation.graphql';

import styles from './LoginPanel.module.css';
import TextBox from '../TextBox';
import Button from '../Button';
import { SettingsContext } from '../../contexts/SettingsContext';

type TProps = {
    setPanel: (name: 'welcome' | 'login' | 'register') => void;
};

const LoginPanel = ({ setPanel }: TProps) => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);
    const { setSettings } = useContext(SettingsContext);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [login, isSending] = useMutation<LoginPanelMutation>(graphql`
        mutation LoginPanelMutation(
            $username: String!
            $password: String!
        ) {
            login(username: $username, password: $password) {
                id
                username
                email
            }
        }
    `);

    const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginError(null);
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (!username || !password) return;
        login({
            variables: { username, password },
            onError: (error) => setLoginError(error.message),
            onCompleted: (res) => {
                setSettings({ userData: res.login });
                navigate('/app');
            },
        });
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
                    onClick={() => setPanel('welcome')}
                >Go back
                </Button>
                <Button
                    type="submit"
                    mode="light"
                    className={styles.btn}
                >Log in
                </Button>
            </div>
            {!isSending || <div className={styles.sending}>Loading...</div>}
            {!loginError || <div className={styles.sending}>{loginError}</div>}
        </form>
    );
};

export default LoginPanel;
