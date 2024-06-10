import { FC, ReactElement } from 'react';
import { useAppContext } from '../../app/providers/AppContext';
import { Footer } from '../footer/footer';

import styles from './payment-template.module.scss';
import { Heading } from '../../shared/components/heading';
import { Logo } from '../../shared/components/logo';
import { TonConnectModal } from '../ton-connect-modal/ton-connect-modal';

const PaymentTemplate: FC = (): ReactElement => {
    const { userData, isMobile } = useAppContext();
    return (
        <div className={styles.app__wrapper}>
            <div className={styles.app__container}>
                <div className={styles.logo_and_heading}>
                    <Logo />
                    <div className={styles.heading_wrapper}>
                        <Heading className={styles.heading_text} level="h1">
                            PlinkO
                        </Heading>
                    </div>
                </div>
                <div className={styles.app__payment}>
                    <TonConnectModal />
                </div>
                <Footer isMobile={isMobile} unclaimedTokens={userData?.unclaimedTokens} />
            </div>
        </div>
    );
};

export default PaymentTemplate;

