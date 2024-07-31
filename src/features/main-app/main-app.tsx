import { FC, ReactElement } from 'react';
import { useAppContext } from '../../app/providers/AppContext';
import { Footer } from '../footer/footer';

import styles from './main-app.module.scss';
import { PlinkoGamePage } from '../Games/Plinko';
import { Heading } from '../../shared/components/heading';
import { Logo } from '../../shared/components/logo';

const MainApp: FC = (): ReactElement => {
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
                <PlinkoGamePage />
                <Footer isMobile={isMobile} unclaimedTokens={userData?.unclaimedWhisks} />
            </div>
        </div>
    );
};

export default MainApp;

