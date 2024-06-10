import { FC } from 'react';
import { Typography } from '../../../../shared/components/typography';
import styles from './in-game-balance.module.scss';

export const InGameBalance: FC = () => {
    return (
        <div className={styles.in_game_balance}>
            <div className={styles.in_game_balance__container}>
                <Typography fontSize="18px" className={styles.in_game_balance__text}>
                    Current in-game balance
                </Typography>
                <div className={styles.in_game_balance__item}>
                    <Typography fontSize="24px" className={styles.in_game_balance__item_amount}>
                        18255
                    </Typography>
                    <Typography fontSize="24px" className={styles.in_game_balance__item_currency}>
                        WHISKS
                    </Typography>
                </div>
            </div>
        </div>
    );
};

