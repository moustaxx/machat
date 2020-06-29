import React, {
    useRef,
    useEffect,
    useLayoutEffect,
    useState,
    useContext,
} from 'react';
import { useQuery } from '@apollo/client';
import InView from 'react-intersection-observer';

import { DateTime } from 'luxon';
import styles from './MessageBox.module.css';
import {
    getMessages,
    subGetMessages,
    TGetMessagesVariables,
    TGetMessages,
} from './MessageBox.graphql';

import useHeadTitleNotification from '../../hooks/useHeadTitleNotification';
import sendDesktopNotification from '../../utils/sendDesktopNotification';
import TopBar from '../TopBar';
import Message from '../Message';
import MessageInput from '../MessageInput';
import MessageSkeleton from '../Message/MessageSkeleton';
import Loading from '../Loading';
import Snackbar from '../Snackbar';
import { SettingsContext } from '../../contexts/SettingsContext';

const MessageBox = () => {
    const {
        data,
        loading,
        error,
        fetchMore,
        subscribeToMore,
    } = useQuery<TGetMessages, TGetMessagesVariables>(getMessages);

    const [isComponentReady, setIsComponentReady] = useState(false);
    const messageBoxRef = useRef<HTMLDivElement | null>(null);
    const bottomHelper = useRef<HTMLDivElement | null>(null);
    const lastDistanceFromBottom = useRef<{ topEdge: number; bottomEdge: number } | null>(null);
    const prevMessageListState = useRef<{ firstMsgID: string, msgCount: number } | null>(null);
    const isTextboxFocused = useRef(false);

    const { settings } = useContext(SettingsContext);

    const [unreadCount, setUnreadCount] = useState(0);

    useHeadTitleNotification(
        unreadCount === 0
            ? null
            : `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`,
    );

    const markAsRead = () => setUnreadCount(0);

    const msgs = data?.messages.slice().reverse();
    const isNoMore = data ? data.messages_aggregate.aggregate.count <= msgs!.length : null;
    const newestMsgCursor = data?.messages.find(
        (m) => !m.id.includes('OPTIMISTIC_'),
    )?.created_at;

    // Subscribe to new messages
    useEffect(() => {
        if (!isComponentReady || !newestMsgCursor) return;

        const unsubscribe = subscribeToMore({
            document: subGetMessages,
            variables: {
                afterCursor: newestMsgCursor,
            },
            updateQuery: (prevData, { subscriptionData: { data: newData } }) => {
                if (!prevData || !newData?.messages[0]) return prevData;
                const prevDataMsgCount = prevData.messages_aggregate.aggregate.count;
                const nextDataMsgCount = newData.messages.length;

                // Not good solution - no notification if someone
                // send you a message when you are typing into text box
                if (!isTextboxFocused.current) setUnreadCount((prev) => prev + nextDataMsgCount);

                if (settings.showDesktopNotifications && document.visibilityState === 'hidden') {
                    newData.messages.forEach((msg) => {
                        sendDesktopNotification({
                            title: `${msg.nickname} sent new message:`,
                            body: msg.content,
                            timestamp: DateTime.fromISO(msg.created_at).toMillis(),
                        });
                    });
                }

                return {
                    messages_aggregate: {
                        aggregate: {
                            count: prevDataMsgCount + nextDataMsgCount,
                        },
                    },
                    messages: [...newData.messages, ...prevData.messages],
                };
            },
        });
        return unsubscribe;
    }, [
        isComponentReady,
        newestMsgCursor,
        settings.showDesktopNotifications,
        subscribeToMore,
        setUnreadCount,
    ]);

    const scrollToBottom = (behavior: 'smooth' | 'auto' = 'auto') => {
        if (!bottomHelper.current) return;
        bottomHelper.current.scrollIntoView({
            behavior,
            block: 'center',
            inline: 'end',
        });
    };

    const saveScrollPosition = ({ currentTarget: target }: React.UIEvent<HTMLDivElement>) => {
        const topEdge = target.scrollHeight - target.scrollTop;
        const bottomEdge = topEdge - target.clientHeight;
        lastDistanceFromBottom.current = { topEdge, bottomEdge };
    };

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        saveScrollPosition(event);
        if (unreadCount !== 0 && lastDistanceFromBottom.current!.bottomEdge < 1) markAsRead();
    };

    // Save info about last displayed messages
    useEffect(() => {
        if (!isComponentReady || !msgs) return;

        prevMessageListState.current = {
            firstMsgID: msgs[0].id,
            msgCount: msgs.length,
        };
    }, [isComponentReady, msgs]);

    // Scroll to bottom on component init
    const hasMessages = (msgs?.length || 0) > 0;
    useLayoutEffect(() => {
        if (isComponentReady && hasMessages && messageBoxRef.current) {
            saveScrollPosition({ currentTarget: messageBoxRef.current } as any);
            scrollToBottom();
        }
    }, [isComponentReady, hasMessages]);

    useEffect(() => {
        setIsComponentReady(true);
    }, []);

    // Handle scroll position when new messages
    useLayoutEffect(() => {
        const prevState = prevMessageListState.current;
        const distanceFromBottom = lastDistanceFromBottom.current;
        if (
            !msgs
                || !prevState
                || !distanceFromBottom
                || !messageBoxRef.current
                || msgs.length === prevState.msgCount
        ) return;

        if (prevState.firstMsgID !== msgs[0].id) {
            // change on the top
            const { scrollHeight } = messageBoxRef.current;
            messageBoxRef.current.scrollTop = scrollHeight - distanceFromBottom.topEdge;
        } else {
            // change on the bottom
            if (distanceFromBottom.bottomEdge < 1 && document.visibilityState === 'visible') { // eslint-disable-line no-lonely-if
                scrollToBottom();
            }
        }
    }, [msgs]);

    const handleLoadMoreMsgs = () => {
        if (!isComponentReady || !msgs) return;
        const beforeCursor = msgs[0].created_at;

        // eslint-disable-next-line consistent-return
        return fetchMore({
            variables: { beforeCursor },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    ...prev,
                    messages: [...prev.messages, ...fetchMoreResult.messages],
                };
            },
        });
    };

    if (error) return <div className={styles.error}>Oh no... {error.message}</div>;

    return (
        <div className={styles.root}>
            <TopBar disableRedirectOnLogoClick />
            <div
                className={styles.container}
                ref={messageBoxRef}
                onScroll={handleScroll}
            >
                {unreadCount ? (
                    <Snackbar
                        message={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`}
                        buttonOnClick={markAsRead}
                        buttonText="Mark as read"
                    />
                ) : null}
                {!isComponentReady || loading ? <Loading /> : (
                    <div className={styles.messagesWrapper}>
                        {hasMessages && isNoMore === false && (
                            <InView
                                as="div"
                                root={messageBoxRef.current}
                                rootMargin="400px"
                                onChange={(inView) => inView && handleLoadMoreMsgs()}
                            >
                                <MessageSkeleton />
                                <MessageSkeleton />
                                <MessageSkeleton />
                            </InView>
                        )}
                        {msgs?.map((it) => (
                            <Message
                                key={it.id}
                                nickname={it.nickname}
                                content={it.content}
                                createdAt={it.created_at}
                            />
                        ))}
                        <div ref={bottomHelper} />
                    </div>
                )}
            </div>
            <MessageInput
                onFocus={() => { isTextboxFocused.current = true; }}
                onBlur={() => { isTextboxFocused.current = false; }}
            />
        </div>
    );
};

export default MessageBox;
