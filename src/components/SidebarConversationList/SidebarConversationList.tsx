import { useFragment, graphql } from 'react-relay/hooks';

import { SidebarConversationList_conversations$key } from './__generated__/SidebarConversationList_conversations.graphql';
// import styles from './SidebarConversationList.module.css';
import SidebarConversationListItem from '../SidebarConversationListItem';

type TProps = {
    me: SidebarConversationList_conversations$key;
};

const SidebarConversationList = ({ me }: TProps) => {
    const { conversations } = useFragment(
        graphql`
            fragment SidebarConversationList_conversations on PersonType {
                conversations {
                    edges {
                    node {
                            id
                            name
                            participants {
                                edges {
                                    node {
                                        id
                                        username
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        me,
    );
    return (
        <div>
            {conversations.edges?.map((conv) => (
                <SidebarConversationListItem
                    key={conv!.node.id}
                    conversation={conv!.node}
                />
            ))}
        </div>
    );
};

export default SidebarConversationList;
