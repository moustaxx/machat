import React, { useRef, useCallback, useLayoutEffect, useEffect, useContext } from 'react';

import styles from './MessagesInbox.module.css';
import Snackbar from '../Snackbar';
import { SnackbarContext } from '../../contexts/SnackbarContext';

type TProps = {
    firstItemID: string;
    lastItemID: string;
};

const MessagesInboxScrollHelper: React.FC<TProps> = ({ children, firstItemID, lastItemID }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const bottomHelperRef = useRef<HTMLDivElement | null>(null);
    const lastDistanceFromBottom = useRef<{ topEdge: number; bottomEdge: number } | null>(null);
    const previousFirstItemID = useRef(firstItemID);

    const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'auto') => {
        if (!bottomHelperRef.current) return;
        bottomHelperRef.current.scrollIntoView({
            behavior,
            block: 'center',
            inline: 'end',
        });
    }, []);

    const saveScrollPosition = ({ currentTarget: target }: React.UIEvent<HTMLDivElement>) => {
        const topEdge = target.scrollHeight - target.scrollTop;
        const bottomEdge = topEdge - target.clientHeight;
        lastDistanceFromBottom.current = { topEdge, bottomEdge };
    };

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        saveScrollPosition(event);
    };

    // Scroll to bottom on component init
    useLayoutEffect(() => {
        if (!containerRef.current) return;
        saveScrollPosition({ currentTarget: containerRef.current } as any);
        scrollToBottom();
    }, [scrollToBottom]);

    // Save info about current first item
    useEffect(() => {
        previousFirstItemID.current = firstItemID;
    }, [firstItemID]);

    // Handle scroll position when new messages
    useLayoutEffect(() => {
        const distanceFromBottom = lastDistanceFromBottom.current;
        if (!distanceFromBottom || !containerRef.current) return;

        if (previousFirstItemID.current !== firstItemID) {
            // change on the top
            const { scrollHeight } = containerRef.current;
            containerRef.current.scrollTop = scrollHeight - distanceFromBottom.topEdge;
        } else if (distanceFromBottom.bottomEdge < 1 && document.visibilityState === 'visible') {
            // change on the bottom
            scrollToBottom();
        }
    }, [firstItemID, lastItemID, scrollToBottom]);

    const { snackbarData } = useContext(SnackbarContext);

    return (
        <div
            className={styles.root}
            ref={containerRef}
            onScroll={handleScroll}
        >
            {snackbarData.message ? (
                <Snackbar
                    message={snackbarData.message}
                    buttonOnClick={snackbarData.buttonOnClick}
                    buttonText={snackbarData.buttonText}
                />
            ) : null}
            <div className={styles.messagesWrapper}>
                {children}
                <div ref={bottomHelperRef} />
            </div>
        </div>
    );
};

export default MessagesInboxScrollHelper;
