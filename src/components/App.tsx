import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MessageBox from './MessageBox';
import IndexScreen from './IndexScreen';
import PageNotFound from './PageNotFound';

import styles from './App.module.css';
import { SettingsContext } from '../contexts/SettingsContext';

const protectedRoute = (component: JSX.Element, condition: string | boolean | null) => {
    return condition ? component : <Navigate to="/" replace />;
};

const App = () => {
    const { nickname } = useContext(SettingsContext).settings;

    return (
        <div className={styles.root}>
            <Routes>
                <Route path="/" element={<IndexScreen />} />
                <Route path="app" element={protectedRoute(<MessageBox />, nickname)} />
                <Route path="404" element={<PageNotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </div>
    );
};

export default App;
