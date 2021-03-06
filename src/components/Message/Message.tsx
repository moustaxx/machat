import { graphql, useFragment } from 'react-relay/hooks';
import emoji from 'react-easy-emoji';

import { Message_data$key } from './__generated__/Message_data.graphql';
import Time from '../Time';

import styles from './Message.module.css';

interface IMessageProps {
    message: Message_data$key;
}

const Message = ({ message }: IMessageProps) => {
    const {
        author,
        content,
        createdAt,
    } = useFragment(
        graphql`
            fragment Message_data on MessageType {
                id
                author {
                    username
                }
                content
                createdAt
            }
        `,
        message,
    );

    return (
        <div className={styles.root}>
            <div className={styles.avatar}>{author.username[0]}</div>
            <div className={styles.container}>
                <div className={styles.firstRow}>
                    <div className={styles.username}>{author.username}</div>
                    {createdAt === 'OPTIMISTIC' ? (
                        <div className={styles.createdAt}>Sending...</div>
                    ) : (
                        <Time
                            time={createdAt as string}
                            className={styles.createdAt}
                        />
                    )}
                </div>
                <div className={styles.content}>{emoji(content, {
                    baseUrl: 'https://twemoji.maxcdn.com/2/svg/',
                    ext: '.svg',
                    size: '',
                })}
                </div>
            </div>
        </div>
    );
};

export default Message;
