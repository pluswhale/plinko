import Lottie from 'react-lottie';
import { FC, ReactElement } from 'react';

type Props = {
    animationData: any;
    loop: boolean | number;
    autoplay?: boolean;
};

export const LottieAnimation: FC<Props> = ({ animationData, loop, autoplay }): ReactElement | null => {
    if (!animationData) {
        return null; // or render a fallback component/spinner
    }
    const defaultOptions = {
        loop,
        autoplay: autoplay || false,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return <Lottie options={defaultOptions} />;
};

