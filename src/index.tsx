import React from 'react';
import { unstable_createRoot as createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import RelayProvider from './providers/RelayProvider';
import SettingsProvider from './contexts/SettingsContext';
import SnackbarProvider from './contexts/SnackbarContext';
import App from './components/App';

const root = document.getElementById('root');
if (!root) throw new Error('no root');

createRoot(root).render(
    <BrowserRouter>
        <RelayProvider>
            <SettingsProvider>
                <SnackbarProvider>
                    <App />
                </SnackbarProvider>
            </SettingsProvider>
        </RelayProvider>
    </BrowserRouter>,
);

registerServiceWorker();
