import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';
import './assets/styles/_variables.scss';
import './assets/styles/_fonts.scss';
import Application from './app';
import { AppContextProvider } from './app/providers/AppContext';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TonConnectUIProvider
            manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
            uiPreferences={{ theme: THEME.DARK }}
            walletsListConfiguration={{
                includeWallets: [
                    {
                        appName: 'safepalwallet',
                        name: 'SafePal',
                        imageUrl: 'https://s.pvcliping.com/web/public_image/SafePal_x288.png',
                        tondns: '',
                        aboutUrl: 'https://www.safepal.com',
                        universalLink: 'https://link.safepal.io/ton-connect',
                        jsBridgeKey: 'safepalwallet',
                        bridgeUrl: 'https://ton-bridge.safepal.com/tonbridge/v1/bridge',
                        platforms: ['ios', 'android', 'chrome', 'firefox'],
                    },
                    {
                        appName: 'tonwallet',
                        name: 'TON Wallet',
                        imageUrl: 'https://wallet.ton.org/assets/ui/qr-logo.png',
                        aboutUrl:
                            'https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd',
                        universalLink: 'https://wallet.ton.org/ton-connect',
                        jsBridgeKey: 'tonwallet',
                        bridgeUrl: 'https://bridge.tonapi.io/bridge',
                        platforms: ['chrome', 'android'],
                    },
                ],
            }}
            actionsConfiguration={{
                twaReturnUrl: 'https://t.me/testWhiskers_bot/testwhisk',
            }}
        >
            <AppContextProvider>
                <Application />
            </AppContextProvider>
        </TonConnectUIProvider>
    </React.StrictMode>,
);

