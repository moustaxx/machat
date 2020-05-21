import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import TopBar from './TopBar';
import MessageBox from './MessageBox';
import LoginScreen from './LoginScreen';
import PageNotFound from './PageNotFound/PageNotFound';
// import LeftSideBar from './LeftSideBar';

import styles from './App.module.css';

const App = () => {
    return (
        <div className={styles.root}>
            {/* <LeftSideBar /> */}
            <div className={styles.container}>
                <TopBar />
                <Routes>
                    <Route path="/" element={<MessageBox />} />
                    <Route path="/404" element={<PageNotFound />} />
                    <Route path="login" element={<LoginScreen />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
