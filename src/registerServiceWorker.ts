export default function registerServiceWorker() {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');

            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker === null) return;

                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log(
                                'New content is available and will be used when all '
                                + 'tabs for this page are closed.',
                            );
                        } else {
                            console.log('Content is cached for offline use.');
                        }
                    }
                };
            };
        } catch (error) {
            console.error('Error during service worker registration:', error);
        }
    });
}
