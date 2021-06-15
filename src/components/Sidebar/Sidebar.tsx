import { useLazyLoadQuery, graphql } from 'react-relay/hooks';

import { SidebarQuery } from './__generated__/SidebarQuery.graphql';
import styles from './Sidebar.module.css';
import SidebarConversationList from '../SidebarConversationList';

const Sidebar = () => {
    const data = useLazyLoadQuery<SidebarQuery>(
        graphql`
            query SidebarQuery {
                me {
                    ...SidebarConversationList_conversations
                }
            }
        `,
        {},
    );

    return (
        <div className={styles.root}>
            <h2 className={styles.heading}>Conversations</h2>
            <SidebarConversationList me={data.me} />
        </div>
    );
};

export default Sidebar;
