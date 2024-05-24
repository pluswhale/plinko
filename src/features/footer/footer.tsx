import { FC, ReactElement } from 'react';
import { Button } from '../../shared/components/button';
import { Typography } from '../../shared/components/typography';

import styles from './footer.module.scss';

interface Props {
    unclaimedTokens: number | undefined;
    isMobile: boolean;
}

export const Footer: FC<Props> = ({ unclaimedTokens, isMobile }): ReactElement => {
    return (
        <div className={styles.app__footer_connect}>
            <div className={styles.app__footer_connect_container}>
                <div className={styles.app__footer_connect_score}>
                    <Typography fontSize={isMobile ? '16px' : '40px'}>Unclaimed whisk</Typography>
                    <Typography fontSize={isMobile ? '30px' : '50px'} fontFamily="Roundy Rainbows, sans-serif">
                        {unclaimedTokens || 0}
                    </Typography>
                </div>
                <Button
                    fontFamily={'Montserrat, sans-serif'}
                    height={isMobile ? '42px' : '42px'}
                    fontSize={isMobile ? '16px' : '40px'}
                    backgroundColor="#0080bb"
                    text={'Connect wallet'}
                    fontWeight={'normal'}
                    width={'fit-content'}
                    textTransform={'none'}
                    borderRadius="24px"
                />
            </div>
        </div>
    );
};

