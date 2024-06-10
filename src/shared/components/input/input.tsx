import { FC, ReactElement } from 'react';
import { InputProps } from './types';

import styles from './input.module.scss';
import { useFormContext } from 'react-hook-form';

export const Input: FC<InputProps> = ({
    value,
    onChange,
    width = '100%',
    name,
    height,
    isRequired,
    label,
    pattern,
    placeholder,
    className,
    customStyles,
    ...props
}): ReactElement => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    console.log('cs', customStyles);

    const renderedInput = () => {
        return onChange ? (
            <input
                {...props}
                value={value}
                onChange={({ target }) => onChange(target.value)}
                style={customStyles?.input || {}}
                className={styles.input}
                placeholder={placeholder}
            /> // binded input
        ) : (
            <>
                <input
                    {...props}
                    style={customStyles?.input || {}}
                    className={styles.input}
                    placeholder={placeholder}
                    {...register(name, {
                        required: isRequired || false,
                        pattern,
                    })}
                />
            </>
        );
    };

    return (
        <div style={{ width, height }} className={`${className || {}}  ${styles.wrapper}`}>
            {label ? (
                <label style={customStyles?.label || {}} className={styles.label} htmlFor={name}>
                    <span className={styles.label_text}>
                        {label} {isRequired && <span className={styles.required_symbol}>*</span>}
                    </span>

                    {renderedInput()}
                </label>
            ) : (
                <>{renderedInput()}</>
            )}
            {/* @ts-ignore */}
            {errors[name] && <p className={styles.input__error}>{errors[name].message}</p>}
        </div>
    );
};

