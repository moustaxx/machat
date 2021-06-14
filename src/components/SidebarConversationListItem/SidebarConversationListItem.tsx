import { Link } from 'react-router-dom';
import { SidebarConversationList_conversations$data } from '../SidebarConversationList/__generated__/SidebarConversationList_conversations.graphql';
import styles from './SidebarConversationListItem.module.css';
import { fromGlobalId } from '../../utils/globalId';

type TEdges = NonNullable<SidebarConversationList_conversations$data['conversations']['edges']>;

type TProps = {
    conversation: NonNullable<TEdges[number]>['node'];
};

const SidebarConversationListItem = ({ conversation }: TProps) => {
    const convID = fromGlobalId(conversation.id).id;

    return (
        <Link to={`/conversation/${convID}`} replace className={styles.root}>
            <div className={styles.picture}>{conversation.name[0]}</div>
            <span>{conversation.name}</span>
        </Link>
    );
};

export default SidebarConversationListItem;
