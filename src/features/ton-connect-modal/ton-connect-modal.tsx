import { Button } from '../../shared/components/button';
import { Typography } from '../../shared/components/typography';
import { useAppContext } from '../../app/providers/AppContext';
import { useTonConnect } from '../../shared/libs/hooks/useTonConnect';
import { useEffect } from 'react';
import { saveUserTonAddress } from '../../shared/api/user/thunks';
// import { useTonWallet } from '@tonconnect/ui-react';
import styles from './ton-connect-modal.module.scss';
import { PaymentView } from '../../pages/payment/components/payment-view/payment-view';

function shortAddress(address: string): string {
    const firstPart = address.slice(0, 4);
    const lastPart = address.slice(-4);

    return firstPart + '..' + lastPart;
}

export const TonConnectModal = () => {
    const { isMobile } = useAppContext();

    const { userFriendlyAddress, open } = useTonConnect();
    // const wallet = useTonWallet();
    const { userData } = useAppContext();

    const onDisconnectWallet = () => {
        for (const key in localStorage) {
            if (key.startsWith('ton-connect')) {
                localStorage.removeItem(key);
            }
        }

        window.location.href = '/';
    };

    // useEffect(() => {
    //     if (userData && userData.userTonAddress !== userFriendlyAddress && userFriendlyAddress && userData?.userId) {
    //         saveUserTonAddress(userData?.userId, { userTonAddress: userFriendlyAddress });
    //     }
    // }, [userData, userFriendlyAddress]);

    return (
        <>
            {userFriendlyAddress ? (
                <PaymentView />
            ) : (
                <>
                    <Typography fontSize="22px" className={styles.connect_wallet_text} lineHeight="32px" align="center">
                        Connect your TON wallet to top up or withdraw your Whisk.
                    </Typography>
                    <Button
                        onClick={open}
                        fontFamily={'Montserrat, sans-serif'}
                        height={isMobile ? '42px' : '42px'}
                        fontSize={isMobile ? '16px' : '40px'}
                        stylesForTexts={{ main: { whiteSpace: 'pre-wrap' }, sub: {} }}
                        backgroundColor="#0080bb"
                        text={'Connect wallet'}
                        fontWeight={'normal'}
                        width={'fit-content'}
                        textTransform={'none'}
                        borderRadius="24px"
                    />
                </>
            )}
        </>
    );
};

