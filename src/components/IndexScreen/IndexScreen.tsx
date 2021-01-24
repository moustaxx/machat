import { useState } from 'react';

import styles from './IndexScreen.module.css';
import logo from '../../assets/chat-icon-white.png';
import people from '../../assets/people.png';
import LoginPanel from '../LoginPanel';
import RegisterPanel from '../RegisterPanel';
import Welcome from '../Welcome';

type TPanels = 'welcome' | 'login' | 'register';

const IndexScreen = () => {
    const [actualVisablePanel, setPanel] = useState<TPanels>('welcome');

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.split1}>
                    <img className={styles.logo} src={logo} alt="Logo" />
                    {actualVisablePanel === 'welcome'
                        ? <Welcome setPanel={setPanel} />
                        : null
                    }
                    {actualVisablePanel === 'login'
                        ? <LoginPanel setPanel={setPanel} />
                        : null
                    }
                    {actualVisablePanel === 'register'
                        ? <RegisterPanel setPanel={setPanel} />
                        : null
                    }
                </div>
                <div className={styles.split2}>
                    <img className={styles.people} src={people} alt="people" />
                </div>
            </div>
        </div>
    );
};

export default IndexScreen;
