import { gql } from '@apollo/client';

export const getMessages = gql`
    query MessageBox_getMessages($beforeCursor: timestamptz) {
        messages(
            limit: 30
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
        messages_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export const subGetMessages = gql`
    subscription MessageBox_subscribeToMessages($afterCursor: timestamptz!) {
        messages(
            limit: 30
            order_by: { created_at: desc }
            where: {
                conversation_id: { _eq: "b6a9e90f-a668-463c-ae48-32221002116c" }
                created_at: { _gt: $afterCursor }
            }
        ) {
            id
            nickname
            content
            created_at
        }
    }
`;

export type TMessage = {
    id: string;
    nickname: string;
    content: string;
    created_at: string;
};

export type TGetMessages = {
    messages: TMessage[];
    messages_aggregate: {
        aggregate: {
            count: number;
        }
    }
};

export type TGetMessagesVariables = {
    beforeCursor?: string;
};
