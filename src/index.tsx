import React from 'react';
import { unstable_createRoot as createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';

import ApolloProvider from './providers/ApolloProvider';
import RelayProvider from './providers/RelayProvider';
import SettingsProvider from './contexts/SettingsContext';
import App from './components/App';

const root = document.getElementById('root');
if (!root) throw new Error('no root');

createRoot(root).render(
    <BrowserRouter>
        <ApolloProvider>
            <RelayProvider>
                <SettingsProvider>
                    <App />
                </SettingsProvider>
            </RelayProvider>
        </ApolloProvider>
    </BrowserRouter>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
