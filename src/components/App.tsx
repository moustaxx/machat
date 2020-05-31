import React, { useContext, lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import clsx from 'clsx';

import styles from './App.module.css';
import { SettingsContext } from '../contexts/SettingsContext';
import Loading from './Loading';

const MessageBox = lazy(() => import('./MessageBox'));
const IndexScreen = lazy(() => import('./IndexScreen'));
const PageNotFound = lazy(() => import('./PageNotFound'));

const protectedRoute = (
    component: JSX.Element,
    condition: string | boolean | null,
    fallback = '/',
) => {
    return condition ? component : <Navigate to={fallback} replace />;
};

const App = () => {
    const { nickname } = useContext(SettingsContext).settings;
    const [isOutlineOn, setOutlineStatus] = useState(false);

    const addOutlineOnTab = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') setOutlineStatus(true);
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={clsx(styles.root, !isOutlineOn && styles.noOutline)}
            onKeyDown={(addOutlineOnTab)}
            onClick={() => setOutlineStatus(false)}
        >
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route
                        path="/"
                        element={nickname
                            ? <Navigate to="/app" replace />
                            : <Navigate to="/welcome" replace />
                        }
                    />
                    <Route
                        path="welcome"
                        element={<IndexScreen />}
                    />
                    <Route
                        path="app"
                        element={protectedRoute(<MessageBox />, nickname)}
                    />
                    <Route
                        path="404"
                        element={<PageNotFound />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/404" replace />}
                    />
                </Routes>
            </Suspense>
        </div>
    );
};

export default App;
