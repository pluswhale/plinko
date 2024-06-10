import { FC } from 'react';
import { Typography } from '../../../../shared/components/typography';
import styles from './currencies-balance.module.scss';

export const CurrenciesBalance: FC = () => {
    return (
        <div className={styles.currencies_balance}>
            <div className={styles.currencies_balance__item}>
                <Typography fontSize="22px" className={styles.currencies_balance__item_name}>
                    WHISK
                </Typography>
                <span className={styles.currencies_balance__item_amount}>1500000</span>
            </div>
            <div className={styles.currencies_balance__item}>
                <Typography fontSize="22px" className={styles.currencies_balance__item_name}>
                    TON
                </Typography>
                <span className={styles.currencies_balance__item_amount}>75.346</span>
            </div>
        </div>
    );
};

