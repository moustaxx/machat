import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import TopBar from './TopBar';
import MessageBox from './MessageBox';
import LoginScreen from './LoginScreen';
import PageNotFound from './PageNotFound';

import styles from './App.module.css';
import { SettingsContext } from '../contexts/SettingsContext';

const protectedRoute = (component: JSX.Element, condition: string | boolean | null) => {
    return condition ? component : <Navigate to="login" replace />;
};

const App = () => {
    const { nickname } = useContext(SettingsContext).settings;

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <TopBar />
                <Routes>
                    <Route path="/" element={protectedRoute(<MessageBox />, nickname)} />
                    <Route path="404" element={<PageNotFound />} />
                    <Route path="login" element={<LoginScreen />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
