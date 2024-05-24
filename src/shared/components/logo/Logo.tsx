import { FC, ReactElement } from 'react';
import styles from './logo.module.scss';

type Props = {
    title?: string;
    fontSize?: string;
    onClick?: () => void;
};

export const Logo: FC<Props> = (props): ReactElement => {
    const { title, fontSize = '32px', onClick } = props;
    return (
        <span onClick={onClick || undefined} style={{ fontSize }} className={styles.logo}>
            {title || 'Whiskers'}
        </span>
    );
};

