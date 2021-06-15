import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './TextBox.module.css';

type TProps = {
    type?: string;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    placeholder?: string;
    className?: string;
};

const TextBox = forwardRef(({
    type,
    minLength,
    maxLength,
    required,
    placeholder,
    className,
}: TProps, ref: React.LegacyRef<HTMLInputElement>) => {
    return (
        <input
            ref={ref}
            type={type}
            minLength={minLength}
            maxLength={maxLength}
            required={required}
            placeholder={placeholder}
            className={clsx(className, styles.root)}
        />
    );
});

export default TextBox;
