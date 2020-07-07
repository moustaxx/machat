import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

type TSnackbarData = {
    message: string | null;
    buttonOnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    buttonText: string | null;
};

type TSnackbarContext = {
    snackbarData: TSnackbarData;
    setSnackbarData: Dispatch<SetStateAction<TSnackbarData>>;
    clearSnackbarData: () => void;
};

const defaultSnackbarData = {
    message: null,
    buttonOnClick: () => { },
    buttonText: null,
};

const defaultContextState = {
    snackbarData: defaultSnackbarData,
    setSnackbarData: () => { },
    clearSnackbarData: () => { },
};

export const SnackbarContext = createContext<TSnackbarContext>(defaultContextState);

const SnackbarProvider: React.FC = ({ children }) => {
    const [snackbarData, setSnackbarData] = useState<TSnackbarData>(defaultSnackbarData);
    const clearSnackbarData = () => setSnackbarData(defaultSnackbarData);

    return (
        <SnackbarContext.Provider
            value={{
                snackbarData,
                setSnackbarData,
                clearSnackbarData,
            }}
            children={children}
        />
    );
};

export default SnackbarProvider;
