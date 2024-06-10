import { FC } from 'react';
import { Typography } from '../../../../shared/components/typography';
import styles from './deposit-or-withdraw.module.scss';
import { Input } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppContext } from '../../../../app/providers/AppContext';
import { usePaymentStore } from '../../../../store/payment';

export const DepositOrWithdraw: FC = () => {
    const { isMobile, userData, topUpCurrentBalance, withdrawCurrentBalance } = useAppContext();
    const methods = useForm();
    const amount = usePaymentStore((state) => state.amount);
    const changeAmount = usePaymentStore((state) => state.changeAmount);

    const onTopUpCurrentBalance = () => {
        topUpCurrentBalance(amount);
    };

    const onWithdrawCurrentBalance = () => {
        if (amount > userData?.points) return;
        withdrawCurrentBalance(amount);
    };

    const onChangeAmount = (value: string) => {
        if (value === '') {
            changeAmount('0');
        }

        const isNumeric = /^\d+$/.test(value);
        if (!isNumeric) {
            return;
        }

        changeAmount(value);
    };

    return (
        <div className={styles.deposit_or_withdraw}>
            <Typography fontSize="18px" className={styles.deposit_or_withdraw__title}>
                Deposit or withdraw WHISKS
            </Typography>

            <FormProvider {...methods}>
                <Input
                    onChange={onChangeAmount}
                    value={String(amount)}
                    placeholder="0"
                    customStyles={{ input: { fontSize: '18px', width: 'fit-content' } }}
                    height="36px"
                    className={styles.deposit_or_withdraw__input_wrapper}
                    name={'amount-whisks'}
                />
            </FormProvider>

            <div className={styles.deposit_or_withdraw__action_buttons}>
                <Button
                    onClick={onTopUpCurrentBalance}
                    fontFamily={'Montserrat, sans-serif'}
                    height={isMobile ? '32px' : '32px'}
                    fontSize={isMobile ? '16px' : '40px'}
                    backgroundImage="linear-gradient(rgb(32 167 228), rgb(0, 128, 187))"
                    fontWeight={'normal'}
                    width={'fit-content'}
                    textTransform={'none'}
                    borderRadius="24px"
                    text={'Top up'}
                />
                <Button
                    onClick={onWithdrawCurrentBalance}
                    fontFamily={'Montserrat, sans-serif'}
                    height={isMobile ? '32px' : '32px'}
                    fontSize={isMobile ? '16px' : '40px'}
                    backgroundImage="linear-gradient(rgb(32 167 228), rgb(0, 128, 187))"
                    fontWeight={'normal'}
                    width={'fit-content'}
                    textTransform={'none'}
                    borderRadius="24px"
                    text={'Withdraw'}
                />
            </div>
        </div>
    );
};

