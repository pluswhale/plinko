import { FC, ReactElement } from 'react';
import { Button } from '../../shared/components/button';
import { Typography } from '../../shared/components/typography';

import styles from './footer.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatNumber } from '../../shared/libs/functions/formatFloatNumber';

interface Props {
    unclaimedTokens: number | undefined;
    isMobile: boolean;
}

export const Footer: FC<Props> = ({ unclaimedTokens, isMobile }): ReactElement => {
    const navigate = useNavigate();
    const location = useLocation();

    const onNavigateToSpecificPage = () => {
        if (location.pathname.includes('payment')) {
            navigate('/plinko');
        } else {
            navigate('/plinko/payment');
        }
    };

    const getButtonName = () => {
        if (location.pathname.includes('payment')) {
            return 'Back to the game';
        } else {
            return 'Deposit / Withdraw';
        }
    };

    return (
        <div className={styles.app__footer_connect}>
            <div className={styles.app__footer_connect_container}>
                <div className={styles.app__footer_connect_score}>
                    <Typography fontSize={isMobile ? '16px' : '40px'}>In-game balance</Typography>
                    <Typography fontSize={isMobile ? '30px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                        {formatNumber(String(unclaimedTokens))}
                    </Typography>
                </div>
                <Button
                    onClick={onNavigateToSpecificPage}
                    fontFamily={'Montserrat, sans-serif'}
                    height={isMobile ? '42px' : '42px'}
                    fontSize={isMobile ? '16px' : '40px'}
                    backgroundImage="linear-gradient(rgb(32 167 228), rgb(0, 128, 187))"
                    text={getButtonName()}
                    fontWeight={'normal'}
                    width={'fit-content'}
                    textTransform={'none'}
                    borderRadius="24px"
                />
            </div>
        </div>
    );
};

