import { Component } from 'react';

type TProps = {
    children: React.ReactNode;
    fallback: (error: Error) => React.ReactNode;
};

type TState = {
    error: Error | null;
};

export default class ErrorBoundary extends Component<TProps, TState> {
    state: TState = { error: null };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    render() {
        const { fallback, children } = this.props;
        const { error } = this.state;

        if (error) return fallback(error);
        return children;
    }
}
