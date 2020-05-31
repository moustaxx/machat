import React, {
    useRef,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';
import { useQuery } from '@apollo/client';
import InView from 'react-intersection-observer';

import styles from './MessageBox.module.css';
import {
    getMessages,
    subGetMessages,
    TGetMessagesVariables,
    TGetMessages,
} from './MessageBox.graphql';

import TopBar from '../TopBar';
import Message from '../Message';
import MessageInput from '../MessageInput';
import MessageSkeleton from '../Message/MessageSkeleton';
import Loading from '../Loading';

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

    const msgs = data?.messages.slice().reverse();
    const isNoMore = data ? data.messages_aggregate.aggregate.count <= msgs!.length : null;

    // Subscribe to new messages
    useEffect(() => {
        if (!isComponentReady) return;

        const unsubscribe = subscribeToMore({
            document: subGetMessages,
            updateQuery: (prevData, { subscriptionData: { data: newData } }) => {
                if (!prevData || !newData) return prevData;

                const msgExists = prevData.messages.find(
                    (msg) => msg.id === newData.messages[0].id,
                );
                if (msgExists) return prevData;

                return {
                    messages_aggregate: {
                        aggregate: {
                            count: prevData.messages_aggregate.aggregate.count + 1,
                        },
                    },
                    messages: [...newData.messages, ...prevData.messages],
                };
            },
        });
        // eslint-disable-next-line consistent-return
        return unsubscribe;
    }, [isComponentReady, subscribeToMore]);

    const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
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
            scrollToBottom('auto');
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
            if (distanceFromBottom.bottomEdge < 1) { // eslint-disable-line no-lonely-if
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
                onScroll={saveScrollPosition}
            >
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
                <MessageInput />
            </div>
        </div>
    );
};

export default MessageBox;
