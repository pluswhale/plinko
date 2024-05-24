import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';
import './assets/styles/_variables.scss';
import './assets/styles/_fonts.scss';
import Application from './app';
import { AppContextProvider } from './app/providers/AppContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppContextProvider>
            <Application />
        </AppContextProvider>
    </React.StrictMode>,
);

