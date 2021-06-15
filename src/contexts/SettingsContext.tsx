import { createContext, useMemo, useCallback, useState, useLayoutEffect } from 'react';
import { LoginPanelMutationResponse } from '../components/LoginPanel/__generated__/LoginPanelMutation.graphql';

type TSettings = {
    userData?: LoginPanelMutationResponse['login'] | null;
    isLoggedIn: boolean;
    isLightTheme: boolean;
    showDesktopNotifications: boolean;
};

type TSettingsContext = {
    settings: TSettings;
    setSettings: (newValue: Partial<TSettings>) => void;
};

const defaultState: TSettingsContext = {
    settings: {
        userData: null,
        isLoggedIn: false,
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
        const newUserData = newValue.userData;
        const oldUserData = settings.userData;
        const isLoggedIn = !!newUserData || (newUserData !== null && oldUserData !== null);
        const newSettings = { ...settings, ...newValue, isLoggedIn };

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
