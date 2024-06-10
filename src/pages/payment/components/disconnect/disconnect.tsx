import { FC } from 'react';
import { Typography } from '../../../../shared/components/typography';
import styles from './disconnect.module.scss';
import { Button } from '../../../../shared/components/button';
import { useTonConnect } from '../../../../shared/libs/hooks/useTonConnect';

function shortAddress(address: string): string {
    const firstPart = address.slice(0, 6);
    const lastPart = address.slice(-6);

    return firstPart + '..' + lastPart;
}

export const Disconnect: FC = () => {
    const { userFriendlyAddress } = useTonConnect();

    return (
        <div className={styles.disconnect}>
            <Typography fontSize="20px" className={styles.disconnect__title}>
                {shortAddress(userFriendlyAddress)}
            </Typography>

            <Button
                fontFamily={'Montserrat, sans-serif'}
                height={'32px'}
                backgroundImage="linear-gradient(to bottom, #DB0038, #BB002F)"
                fontSize={'16px'}
                fontWeight={'normal'}
                width={'70%'}
                textTransform={'none'}
                borderRadius="24px"
                text={'Disconnect'}
            />
        </div>
    );
};

