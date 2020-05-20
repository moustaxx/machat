import React from 'react';

import TopBar from './TopBar';
import MessageBox from './MessageBox';
import LoginScreen from './LoginScreen';
// import LeftSideBar from './LeftSideBar';

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
