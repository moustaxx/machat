import { useEffect } from 'react';

import notificationSound from '../assets/notification_sound.mp3';

const headTitle = document.head.getElementsByTagName('title')[0];

const APP_NAME = headTitle.text;

const audio = new Audio(notificationSound);

const useHeadTitleNotification = (notification: string | null) => {
    useEffect(() => {
        if (!notification) return;

        void audio.play();

        let isNotifyTitle = false;
        const interval = window.setInterval(() => {
            if (!isNotifyTitle) {
                headTitle.text = `${notification} - ${APP_NAME}`;
            } else {
                headTitle.text = APP_NAME;
            }
            isNotifyTitle = !isNotifyTitle;
        }, 2000);

        return () => {
            window.clearInterval(interval);
            headTitle.text = APP_NAME;
        };
    }, [notification]);
};

export default useHeadTitleNotification;
