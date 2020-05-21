import React, { createContext, useMemo, useCallback, useState } from 'react';

type TSettings = {
    nickname: string | null;
};

type TSettingsContext = {
    settings: TSettings;
    setSettings: (newValue: TSettings) => void;
};

const defaultState: TSettingsContext = {
    settings: {
        nickname: null,
    },
    setSettings: () => { },
};

export const SettingsContext = createContext<TSettingsContext>(defaultState);

const saveSettings = (settings: TSettings) => localStorage.setItem(
    'settings',
    JSON.stringify(settings),
);

const getSettings = (): TSettings => {
    const data = localStorage.getItem('settings');
    if (!data) return defaultState.settings;

    return JSON.parse(data);
};

const SettingsProvider: React.FC = ({ children }) => {
    const [settings, setSettingsState] = useState(getSettings);

    const setSettings = useCallback((newValue: TSettings) => {
        const newSettings = { ...settings, ...newValue };

        saveSettings(newSettings);
        setSettingsState(newSettings);
    }, [settings]);

    const settingsCtxValue = useMemo(() => ({
        settings,
        setSettings,
    }), [settings, setSettings]);

    return (
        <SettingsContext.Provider
            value={settingsCtxValue}
            children={children}
        />
    );
};

export default SettingsProvider;
