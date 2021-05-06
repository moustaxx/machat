import { useParams } from 'react-router-dom';

import TopBar from '../TopBar';
import Conversation from '../Conversation';

import styles from './MainScreen.module.css';

const MainScreen = () => {
    const conversationID = Number(useParams().conversationID) || null;

    return (
        <div className={styles.root}>
            <TopBar />
            <div className={styles.wrapper}>
                {conversationID && (
                    <Conversation
                        conversationID={conversationID}
                        key={conversationID}
                    />
                )}
            </div>
        </div>
    );
};

export default MainScreen;
