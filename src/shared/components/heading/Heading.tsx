import React, { FC, ReactElement } from 'react';
import './heading.scss';

interface HeadingProps {
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    className?: string;
    children: React.ReactNode;
}

export const Heading: FC<HeadingProps> = ({ level = 'h1', className, children, ...props }): ReactElement => {
    const Component = level as keyof JSX.IntrinsicElements;

    return (
        <Component className={className} {...props}>
            {children}
        </Component>
    );
};

