import { useMemo, useContext, useRef } from 'react';
import { graphql, useSubscription } from 'react-relay/hooks';
import { GraphQLSubscriptionConfig } from 'relay-runtime';
import { DateTime } from 'luxon';

import {
    useNewMessageNotificationSubscription as SubscriptionType,
} from './__generated__/useNewMessageNotificationSubscription.graphql';
import sendDesktopNotification from '../../utils/sendDesktopNotification';
import { SettingsContext } from '../../contexts/SettingsContext';

type SubscriptionConfigType = GraphQLSubscriptionConfig<SubscriptionType>;

const useNewMessageNotification = () => {
    const { settings } = useContext(SettingsContext);
    const isFirstSubscriptionPassed = useRef(false);

    const subscriptionConfig: SubscriptionConfigType = useMemo(() => ({
        subscription: graphql`
            subscription useNewMessageNotificationSubscription {
                messages_connection(
                    order_by: { created_at: asc },
                    last: 1,
                    where: {
                        conversation_id: {
                            _eq: "b6a9e90f-a668-463c-ae48-32221002116c",
                        }
                    },
                ) {
                    edges {
                        node {
                            nickname
                            content
                            createdAt: created_at
                            ...Message_data
                        }
                    }
                }
            }
        `,
        variables: {},
        onNext: (res) => {
            if (!res) return;
            const msg = res.messages_connection.edges[0].node;

            if (settings.showDesktopNotifications
                && document.visibilityState === 'hidden'
                && isFirstSubscriptionPassed.current
            ) {
                void sendDesktopNotification({
                    title: `${msg.nickname} sent new message:`,
                    body: msg.content,
                    timestamp: DateTime.fromISO(msg.createdAt as string).toMillis(),
                });
            }
            isFirstSubscriptionPassed.current = true;
        },
    }), [settings.showDesktopNotifications]);

    useSubscription(subscriptionConfig);
};

export default useNewMessageNotification;
