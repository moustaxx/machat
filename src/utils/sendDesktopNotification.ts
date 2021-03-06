type TDesktopNotification = {
    title: string;
    body?: string;
    timestamp?: number;
    options?: NotificationOptions;
};

const sendDesktopNotification = async ({
    title,
    body,
    timestamp,
    options,
}: TDesktopNotification) => {
    if (!('Notification' in window)) {
        return console.log('This browser does not support desktop notification');
    }
    await Notification.requestPermission();
    return new Notification(title, { body, timestamp, ...options });
};

export default sendDesktopNotification;
