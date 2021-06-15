import { useRef, useContext, useState } from 'react';
import { graphql, useMutation } from 'react-relay/hooks';
import { useNavigate } from 'react-router-dom';
import { RegisterPanelMutation } from './__generated__/RegisterPanelMutation.graphql';

import styles from './RegisterPanel.module.css';
import TextBox from '../TextBox';
import Button from '../Button';
import { SettingsContext } from '../../contexts/SettingsContext';

type TProps = {
    setPanel: (name: 'welcome' | 'login' | 'register') => void;
};

const RegisterPanel = ({ setPanel }: TProps) => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);
    const { setSettings } = useContext(SettingsContext);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [register, isSending] = useMutation<RegisterPanelMutation>(graphql`
        mutation RegisterPanelMutation(
            $username: String!
            $password: String!
            $email: String!
        ) {
            register(username: $username, password: $password, email: $email) {
                id
                username
                email
            }
        }
    `);

    const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginError(null);
        const email = emailRef.current?.value;
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (!email || !username || !password) return;
        register({
            variables: { email, username, password },
            onError: (error) => setLoginError(error.message),
            onCompleted: (res) => {
                setSettings({ userData: res.register });
                navigate('/app');
            },
        });
    };

    return (
        <form className={styles.root} onSubmit={handleRegisterSubmit}>
            <h1 className={styles.heading}>Sign up</h1>
            <TextBox
                ref={emailRef}
                minLength={4}
                maxLength={20}
                required
                placeholder="Email"
            />
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
                >Sign up
                </Button>
            </div>
            {!isSending || <div className={styles.sending}>Loading...</div>}
            {!loginError || <div className={styles.sending}>{loginError}</div>}
        </form>
    );
};

export default RegisterPanel;
