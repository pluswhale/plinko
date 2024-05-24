import styles from './loader.module.scss';

import loaderIcon from '../../../assets/images/loader.png';
import { FC } from 'react';

interface Props {
    className?: string;
}

export const Loader: FC<Props> = ({ className }) => {
    return <img className={`${className && {}} ${styles.loader}`} src={loaderIcon} alt="loader" />;
};

