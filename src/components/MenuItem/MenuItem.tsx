import React from 'react';
import clsx from 'clsx';

import styles from './MenuItem.module.css';
import Switch from '../Switch';

type TButton = React.DOMAttributes<HTMLButtonElement>;

type TProps = {
    onClick?: TButton['onClick'],
    onKeyDown?: TButton['onKeyDown'],
    className?: string,
    label: string,
    icon?: React.ReactNode,
    isSwitch?: boolean,
    isSwitchToggled?: boolean,
};

const MenuItem = ({
    className,
    onClick,
    onKeyDown,
    isSwitchToggled = false,
    label,
    icon,
    isSwitch,
}: TProps) => {
    return (
        <button
            className={clsx(styles.root, className)}
            onClick={onClick}
            onKeyDown={onKeyDown}
            type="button"
        >
            {icon}
            <span>{label}</span>
            {isSwitch && (
                <Switch
                    className={styles.switch}
                    isActive={isSwitchToggled}
                />
            )}
        </button>
    );
};

export default MenuItem;