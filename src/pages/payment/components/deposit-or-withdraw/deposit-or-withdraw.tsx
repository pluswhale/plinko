import { FC } from 'react';
import { Typography } from '../../../../shared/components/typography';
import styles from './deposit-or-withdraw.module.scss';
import { Input } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppContext } from '../../../../app/providers/AppContext';

export const DepositOrWithdraw: FC = () => {
    const { isMobile } = useAppContext();
    const methods = useForm();
    return (
        <div className={styles.deposit_or_withdraw}>
            <Typography fontSize="18px" className={styles.deposit_or_withdraw__title}>
                Deposit or withdraw WHISKS
            </Typography>

            <FormProvider {...methods}>
                <Input
                    customStyles={{ input: { fontSize: '18px', width: 'fit-content' } }}
                    height="36px"
                    className={styles.deposit_or_withdraw__input_wrapper}
                    name={'amount-whisks'}
                />
            </FormProvider>

            <div className={styles.deposit_or_withdraw__action_buttons}>
                <Button
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

