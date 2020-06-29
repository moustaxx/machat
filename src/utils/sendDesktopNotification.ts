type TDesktopNotification = {
    title: string;
    body?: string;
    timestamp?: number;
    options?: NotificationOptions;
};

const sendDesktopNotification = ({ title, body, timestamp, options }: TDesktopNotification) => {
    if (!('Notification' in window)) {
        return console.log('This browser does not support desktop notification');
    }
    Notification.requestPermission();
    return new Notification(title, { body, timestamp, ...options });
};

export default sendDesktopNotification;
