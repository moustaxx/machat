import React from 'react';

type TProps = {
    children: React.ReactNode;
    fallback: React.ReactNode;
};

type TState = {
    error: Error | null;
};

export default class ErrorBoundary extends React.Component<TProps, TState> {
    state: TState = { error: null };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    render() {
        const { fallback, children } = this.props;
        const { error } = this.state;

        if (error) return fallback;
        return children;
    }
}
