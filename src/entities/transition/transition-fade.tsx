import { Transition } from 'react-transition-group';
import { FC, ReactElement, useRef } from 'react';

type Props = {
    inProp: boolean;
    children: ReactElement;
};

const duration = 3000;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
};

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
} as { [key: string]: any };

export const Fade: FC<Props> = ({ inProp, children }) => {
    const nodeRef = useRef(null);
    return (
        <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
            {(state: any) => (
                <div
                    ref={nodeRef}
                    style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                    }}
                >
                    {children}
                </div>
            )}
        </Transition>
    );
};

