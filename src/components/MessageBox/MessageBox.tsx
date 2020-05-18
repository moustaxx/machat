import React, {
    useRef,
    useState,
    useEffect,
    useLayoutEffect,
} from 'react';
import { gql, useQuery } from '@apollo/client';

import useIsMounted from '../../hooks/useIsMounted';
import Message from './Message';
import MessageInput from './MessageInput';

import styles from './MessageBox.module.css';

type TMessage = {
    id: string;
    nickname: string;
    content: string;
    created_at: string;
};

type TGetMessages = {
    messages: TMessage[]
};
type TGetMessagesVariables = {
    beforeCursor?: string;
};

const getMessages = gql`
    query MessageBox_getMessages($beforeCursor: timestamptz) {
        messages(
            limit: 10
            order_by: { created_at: desc }
            where: {
                conversation_id: { _eq: "b6a9e90f-a668-463c-ae48-32221002116c" }
                created_at: { _lt: $beforeCursor }
            }
        ) {
            id
            nickname
            content
            created_at
        }
    }
`;

const subGetMessages = gql`
    subscription MessageBox_subscribeToMessages {
        messages(
            limit: 1
            order_by: { created_at: desc }
            where: {
                conversation_id: { _eq: "b6a9e90f-a668-463c-ae48-32221002116c" }
            }
        ) {
            id
            nickname
            content
            created_at
        }
    }
`;

const MessageBox = () => {
    const {
        data,
        loading,
        error,
        fetchMore,
        subscribeToMore,
    } = useQuery<TGetMessages, TGetMessagesVariables>(getMessages);

    const isMounted = useIsMounted();
    const [isNoMore, setIsNoMore] = useState(false);

    const messageBoxRef = useRef<HTMLDivElement | null>(null);
    const bottomHelper = useRef<HTMLDivElement | null>(null);
    const lastDistanceFromBottom = useRef<{ topEdge: number; bottomEdge: number } | null>(null);
    const prevMessageListState = useRef<{ firstMsgID: string, msgCount: number } | null>(null);

    const msgs = data?.messages.slice().reverse();

    // Subscribe to new messages
    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: subGetMessages,
            updateQuery: (prevData, { subscriptionData: { data: newData } }) => {
                if (!prevData || !newData) return prevData;

                const msgExists = prevData.messages.find(
                    (msg) => msg.id === newData.messages[0].id,
                );
                if (msgExists) return prevData;

                return {
                    messages: [...newData.messages, ...prevData.messages],
                };
            },
        });
        return unsubscribe;
    }, [subscribeToMore]);

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
        if (!msgs) return;

        prevMessageListState.current = {
            firstMsgID: msgs[0].id,
            msgCount: msgs.length,
        };
    }, [msgs]);

    // Scroll to bottom on component init
    const hasMessages = (msgs?.length || 0) > 0;
    useLayoutEffect(() => {
        if (hasMessages) {
            saveScrollPosition({ currentTarget: messageBoxRef.current } as any);
            scrollToBottom('auto');
        }
    }, [hasMessages]);

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
        if (!msgs) return;
        const beforeCursor = msgs[0].created_at;

        // eslint-disable-next-line consistent-return
        return fetchMore({
            variables: { beforeCursor },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                if (fetchMoreResult.messages.length < 10 && isMounted()) {
                    setIsNoMore(true);
                }

                return {
                    messages: [...prev.messages, ...fetchMoreResult.messages],
                };
            },
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Oh no... {error.message}</p>;

    return (
        <div
            className={styles.root}
            ref={messageBoxRef}
            onScroll={saveScrollPosition}
        >
            <div className={styles.messagesWrapper}>
                <button
                    type="button"
                    disabled={isNoMore}
                    onClick={handleLoadMoreMsgs}
                >
                    get more
                </button>
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
            <MessageInput />
        </div>
    );
};

export default MessageBox;
