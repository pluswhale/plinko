import { CSSProperties } from 'react';

export type InputProps = {
    value?: string;
    onChange?: (value: string) => void; // Если этот пропс передан, то это связанный инпут и работает без register из hook-form
    width?: string;
    height?: string;
    name: string;
    placeholder?: string;
    className?: string;
    customStyles?: { label?: CSSProperties; input?: CSSProperties };
    isRequired?: boolean;
    label?: string;
    pattern?: Pattern;
};

type Pattern = {
    value: RegExp;
    message: string;
};

