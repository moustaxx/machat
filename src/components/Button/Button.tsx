import { forwardRef } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

type TProps = {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    mode?: 'dark' | 'light' | 'colored';
    ariaLabel?: string;
    className?: string;
};

const Button: React.FC<TProps> = forwardRef(({
    onClick,
    type,
    mode = 'colored',
    children,
    ariaLabel,
    className,
}, ref: React.Ref<HTMLButtonElement>) => {
    return (
        <button
            ref={ref}
            onClick={onClick}
            aria-label={ariaLabel}
            type={type || 'button'} // eslint-disable-line react/button-has-type
            className={clsx(
                className,
                mode === 'light' && styles.root,
                mode === 'dark' && styles.dark,
                mode === 'colored' && styles.colored,
            )}
        >
            {children}
        </button>
    );
});

export default Button;
