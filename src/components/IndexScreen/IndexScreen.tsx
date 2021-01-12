import { useContext, useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import styles from './IndexScreen.module.css';
import logo from '../../assets/chat-icon-white.png';
import people from '../../assets/people.png';
import { SettingsContext } from '../../contexts/SettingsContext';
import LoginPanel from '../LoginPanel';
import Welcome from '../Welcome';

const IndexScreen = () => {
    const navigate = useNavigate();
    const { settings } = useContext(SettingsContext);
    const [isLoginPanelShown, showLoginPanel] = useState(false);

    const handleClickGetIn = () => {
        if (settings.nickname) navigate('/app');
        showLoginPanel(true);
    };

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={clsx(styles.split, styles.splitColorized)}>
                    <img className={styles.logo} src={logo} alt="Logo" />
                    {isLoginPanelShown
                        ? <LoginPanel />
                        : <Welcome handleClickGetIn={handleClickGetIn} />
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
