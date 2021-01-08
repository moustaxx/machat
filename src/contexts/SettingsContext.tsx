import React, { createContext, useMemo, useCallback, useState, useLayoutEffect } from 'react';

type TSettings = {
    nickname: string | null;
    isLightTheme: boolean;
    showDesktopNotifications: boolean;
};

type TSettingsContext = {
    settings: TSettings;
    setSettings: (newValue: Partial<TSettings>) => void;
};

const defaultState: TSettingsContext = {
    settings: {
        nickname: null,
        isLightTheme: false,
        showDesktopNotifications: true,
    },
    setSettings: () => { },
};

export const SettingsContext = createContext<TSettingsContext>(defaultState);

const saveSettings = (settings: TSettings) => localStorage.setItem(
    'settings',
    JSON.stringify(settings),
);

const getSettings = () => {
    const data = localStorage.getItem('settings');
    if (!data) return defaultState.settings;

    return JSON.parse(data) as TSettings;
};

const SettingsProvider: React.FC = ({ children }) => {
    const [settings, setSettingsState] = useState(getSettings);

    const setSettings: TSettingsContext['setSettings'] = useCallback((newValue) => {
        const newSettings = { ...settings, ...newValue };

        saveSettings(newSettings);
        setSettingsState(newSettings);
    }, [settings]);

    const settingsCtxValue = useMemo(() => ({
        settings,
        setSettings,
    }), [settings, setSettings]);

    const { isLightTheme } = settings;
    useLayoutEffect(() => {
        const htmlRoot = document.documentElement;
        if (isLightTheme) htmlRoot.className = 'lightMode';
        else htmlRoot.className = '';
    }, [isLightTheme]);

    return (
        <SettingsContext.Provider
            value={settingsCtxValue}
            children={children}
        />
    );
};

export default SettingsProvider;
