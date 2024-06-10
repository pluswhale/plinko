import { useContext } from 'react';
import { TonConnectUIContext, useTonAddress, useTonConnectModal } from '@tonconnect/ui-react';

export const useTonConnect = (): {
    disconnect: () => void;
    userFriendlyAddress: string;
    open: () => void;
} => {
    const { open } = useTonConnectModal();
    const userFriendlyAddress = useTonAddress();
    const context = useContext(TonConnectUIContext);

    if (!context) {
        throw new Error('useTonConnect must be used within a TonConnectUIProvider');
    }

    const { disconnect } = context;
    return { disconnect, userFriendlyAddress, open };
};

