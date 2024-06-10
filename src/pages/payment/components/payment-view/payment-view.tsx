import { FC } from 'react';
import { Typography } from '../../../../shared/components/typography';
import { CurrenciesBalance } from '../currencies-balance/currencies-balance';
import { InGameBalance } from '../in-game-balance/in-game-balance';
import { DepositOrWithdraw } from '../deposit-or-withdraw/deposit-or-withdraw';
import { Disconnect } from '../disconnect/disconnect';
import { useAppContext } from '../../../../app/providers/AppContext';

export const PaymentView: FC = () => {
    const { userData } = useAppContext();
    return (
        <>
            <Typography fontSize="16px" lineHeight="32px" align="center">
                You are successfully connected.
            </Typography>
            <CurrenciesBalance />
            <InGameBalance balance={userData?.points} />
            <DepositOrWithdraw />
            <Disconnect />
        </>
    );
};

