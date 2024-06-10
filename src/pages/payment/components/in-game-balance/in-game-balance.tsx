import { FC, ReactElement } from 'react';
import { Typography } from '../../../../shared/components/typography';
import styles from './in-game-balance.module.scss';
import { formatNumber } from '../../../../shared/libs/functions/formatFloatNumber';

type Props = {
    balance: number;
};

export const InGameBalance: FC<Props> = ({ balance }): ReactElement => {
    return (
        <div className={styles.in_game_balance}>
            <div className={styles.in_game_balance__container}>
                <Typography fontSize="18px" className={styles.in_game_balance__text}>
                    Current in-game balance
                </Typography>
                <div className={styles.in_game_balance__item}>
                    <Typography fontSize="24px" className={styles.in_game_balance__item_amount}>
                        {formatNumber(String(balance))}
                    </Typography>
                    <Typography fontSize="24px" className={styles.in_game_balance__item_currency}>
                        WHISKS
                    </Typography>
                </div>
            </div>
        </div>
    );
};

