import React, { useContext, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { MdLightbulbOutline, MdPowerSettingsNew } from 'react-icons/md';

import styles from './TopBar.module.css';
import { SettingsContext } from '../../contexts/SettingsContext';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import Menu from '../Menu';
import MenuItem from '../MenuItem';

type TProps = {
    disableRedirectOnLogoClick?: boolean;
};

const TopBar = ({
    disableRedirectOnLogoClick = false,
}: TProps) => {
    const { settings, setSettings } = useContext(SettingsContext);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const dropDownRef = useRef<HTMLButtonElement | null>(null);
    const client = useApolloClient();

    useOnClickOutside(menuRef, (event) => {
        const path = event.composedPath();
        const isButtonClicked = path.includes(dropDownRef.current!);
        if (isButtonClicked) return;
        setMenuOpen(false);
    });


    const handleDropDownClick = () => {
        setMenuOpen(!isMenuOpen);
    };

    const switchDarkMode = () => {
        console.log('switchDarkMode');
        setSettings({ isLightTheme: !settings.isLightTheme });
    };

    const handleLogout = () => {
        setSettings({ nickname: null });
        client.clearStore();
    };

    return (
        <div className={styles.root}>
            {disableRedirectOnLogoClick
                ? <span className={styles.link}>MaChat</span>
                : <Link to="/" className={styles.link}>MaChat</Link>
            }
            {settings.nickname && (
                <button
                    className={styles.dropDown}
                    onClick={handleDropDownClick}
                    ref={dropDownRef}
                    type="button"
                >
                    <div className={styles.avatar}>{settings.nickname[0]}</div>
                    <span>{settings.nickname}</span>
                    <svg
                        className={styles.dropDownArrow}
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M7 10l5 5 5-5z" />
                    </svg>
                </button>
            )

            }
            {isMenuOpen && (
                <Menu menuRef={menuRef} className={styles.menu}>
                    <MenuItem
                        isSwitch
                        label="Dark mode"
                        icon={<MdLightbulbOutline />}
                        onClick={switchDarkMode}
                        isSwitchToggled={!settings.isLightTheme}
                    />
                    <MenuItem
                        label="Log out"
                        icon={<MdPowerSettingsNew />}
                        onClick={handleLogout}
                    />
                </Menu>
            )}
        </div>
    );
};

export default TopBar;
