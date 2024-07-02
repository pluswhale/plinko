import Lottie from 'react-lottie';
// import { Player } from '@lottiefiles/react-lottie-player';
import { FC, ReactElement } from 'react';

type Props = {
    animationData: any;
    loop: boolean | number;
    autoplay?: boolean;
};

export const LottieAnimation: FC<Props> = ({ animationData, loop, autoplay }): ReactElement | null => {
    if (!animationData) {
        return null;
    }
    const defaultOptions = {
        loop,
        autoplay: autoplay || false,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return <Lottie style={{ width: '225px', height: '332px' }} options={defaultOptions} />;
};

