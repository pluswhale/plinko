import { Button } from '../../shared/components/button';
import { Typography } from '../../shared/components/typography';
import { useAppContext } from '../../app/providers/AppContext';
import { useTonConnect } from '../../shared/libs/hooks/useTonConnect';
import styles from './ton-connect-modal.module.scss';
import { PaymentView } from '../../pages/payment/components/payment-view/payment-view';

export const TonConnectModal = () => {
    const { isMobile } = useAppContext();

    const { userFriendlyAddress, open } = useTonConnect();
    // const wallet = useTonWallet();
    // const { userData } = useAppContext();

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
                    <Typography fontSize="16px" className={styles.connect_wallet_text} lineHeight="24px" align="center">
                        Connect your TON wallet to top up or withdraw your Whisk.
                    </Typography>
                    <Button
                        onClick={open}
                        fontFamily={'Montserrat, sans-serif'}
                        height={isMobile ? '32px' : '32px'}
                        fontSize={isMobile ? '16px' : '40px'}
                        stylesForTexts={{ main: { whiteSpace: 'pre-wrap' }, sub: {} }}
                        backgroundImage="linear-gradient(rgb(32 167 228), rgb(0, 128, 187))"
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

