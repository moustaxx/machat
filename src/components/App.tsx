import React from 'react';
import TopBar from './TopBar/TopBar';
import MessageBox from './MessageBox/MessageBox';
// import LeftSideBar from './LeftSideBar/LeftSideBar';

import styles from './App.module.css';

const App = () => {
    return (
        <div className={styles.root}>
            {/* <LeftSideBar /> */}
            <div className={styles.container}>
                <TopBar />
                <MessageBox />
            </div>
        </div>
    );
};

export default App;
