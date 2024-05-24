import { FC, ReactElement } from 'react';
import { Heading } from '../../shared/components/heading';
import { Loader } from '../../shared/components/loader/Loader';
import { Logo } from '../../shared/components/logo';
import { Typography } from '../../shared/components/typography';

import styles from './loader-screen.module.scss';

const LoaderScreen: FC = (): ReactElement => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.logo_and_heading}>
                    <Logo />
                    <div className={styles.heading_wrapper}>
                        <Heading level="h1">Plinko</Heading>
                    </div>
                </div>

                <Loader />
                <Typography fontSize="32px" fontFamily="Roundy Rainbows, sans-serif">
                    loading...
                </Typography>
            </div>
        </div>
    );
};

export default LoaderScreen;

