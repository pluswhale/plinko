import Lottie from 'lottie-react';
import { FC, ReactElement } from 'react';

type Props = {
    animationData: any;
    loop: boolean | number;
    autoplay?: boolean;
};

export const LottieAnimation: FC<Props> = ({ animationData, loop, autoplay }): ReactElement => {
    return <Lottie animationData={animationData} loop={loop} autoplay={autoplay || false} />;
};

