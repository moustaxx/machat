// import { useMemo } from 'react';
// import { graphql, useSubscription } from 'react-relay/hooks';
// import { GraphQLSubscriptionConfig, ConnectionHandler } from 'relay-runtime';

// import {
//     useMessagesInboxNewMsgSubscription as SubscriptionType,
// } from './__generated__/useMessagesInboxNewMsgSubscription.graphql';

// type SubscriptionConfigType = GraphQLSubscriptionConfig<SubscriptionType>;

// const useMessagesInboxNewMsgSubscription = (after: string) => {
//     const subscriptionConfig: SubscriptionConfigType = useMemo(() => ({
//         subscription: graphql`
//             subscription useMessagesInboxNewMsgSubscription(
//                 $after: String!
//             ) {
//                 messages_connection(
//                     order_by: { created_at: asc },
//                     after: $after,
//                     where: {
//                         conversation_id: {
//                             _eq: "b6a9e90f-a668-463c-ae48-32221002116c",
//                         }
//                     },
//                 ) {
//                     edges {
//                         cursor
//                         node {
//                             id
//                             ...Message_data
//                         }
//                     }
//                 }
//             }
//         `,
//         variables: {
//             after,
//         },
//         updater: (store) => {
//             const connectionRecord = ConnectionHandler.getConnection(
//                 store.getRoot(),
//                 'MessagesFragment__messages_connection',
//                 {
//                     order_by: { created_at: 'asc' },
//                     where: {
//                         conversation_id: {
//                             _eq: 'b6a9e90f-a668-463c-ae48-32221002116c',
//                         },
//                     },
//                 },
//             );
//             if (!connectionRecord) return;

//             const payload = store.getRootField('messages_connection');
//             const payloadEdges = payload.getLinkedRecords('edges');
//             const connectionEdges = connectionRecord.getLinkedRecords('edges')?.reverse();

//             payloadEdges.forEach((payloadEdge) => {
//                 const resNode = payloadEdge.getLinkedRecord('node');
//                 const resNodeID = resNode.getValue('id');

//                 const existingItem = connectionEdges?.find((cachedEdge) => {
//                     const cachedNode = cachedEdge.getLinkedRecord('node');
//                     const cachedNodeID = cachedNode?.getValue('id');
//                     return cachedNodeID === resNodeID;
//                 });
//                 if (existingItem) return;

//                 const newEdge = ConnectionHandler.buildConnectionEdge(
//                     store,
//                     connectionRecord,
//                     payloadEdge,
//                 );
//                 if (!newEdge) return;
//                 ConnectionHandler.insertEdgeAfter(connectionRecord, newEdge);
//             });
//         },
//     }), [after]);

//     useSubscription(subscriptionConfig);
// };

// export default useMessagesInboxNewMsgSubscription;
