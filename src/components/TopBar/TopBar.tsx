import React, { useContext, useState, useRef } from 'react';
import { commitLocalUpdate, RecordSourceSelectorProxy } from 'relay-runtime';
import { useRelayEnvironment } from 'react-relay/hooks';
import { Link } from 'react-router-dom';
import {
    MdLightbulbOutline,
    MdPowerSettingsNew,
    MdArrowDropDown,
    MdNotifications,
} from 'react-icons/md';

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
    const environment = useRelayEnvironment();

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
        setSettings({ isLightTheme: !settings.isLightTheme });
    };

    const switchNotificationOption = () => {
        setSettings({
            showDesktopNotifications: !settings.showDesktopNotifications,
        });
    };

    const handleLogout = () => {
        setSettings({ nickname: null });
        commitLocalUpdate(environment, (store) => {
            (store as RecordSourceSelectorProxy).invalidateStore();
        });
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
                    <MdArrowDropDown size={30} aria-hidden />
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
                        isSwitch
                        label="Notifications"
                        icon={<MdNotifications />}
                        onClick={switchNotificationOption}
                        isSwitchToggled={settings.showDesktopNotifications}
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
