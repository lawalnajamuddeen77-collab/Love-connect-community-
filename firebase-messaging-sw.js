importScripts(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey:
        "AIzaSyDs3GiBIWM-SXmgh67E19CmkLbrD80E-6o",

    authDomain:
        "love-connect-application.firebaseapp.com",

    projectId:
        "love-connect-application",

    storageBucket:
        "love-connect-application.firebasestorage.app",

    messagingSenderId:
        "173097166265",

    appId:
        "1:173097166265:web:2436178e371354ac660268"
});

const messaging =
    firebase.messaging();


messaging.onBackgroundMessage(
    (payload) => {

        console.log(
            "DMS Chat background message:",
            payload
        );

        const title =
            payload.notification?.title ||
            "DMS Chat 💬";

        const body =
            payload.notification?.body ||
            "You have a new message";

        const senderId =
            payload.data?.senderId || "";

        self.registration.showNotification(
            title,
            {
                body: body,

                icon:
                    "/icon-192.png",

                badge:
                    "/icon-192.png",

                tag:
                    senderId
                        ? `chat-${senderId}`
                        : "dms-chat-message",

                vibrate:
                    [
                        300,
                        100,
                        300,
                        100,
                        500
                    ],

                data: {
                    senderId: senderId
                }
            }
        );
    }
);


self.addEventListener(
    "notificationclick",
    (event) => {

        event.notification.close();

        const senderId =
            event.notification.data?.senderId || "";

        const url =
            senderId
                ? `/?chat=${encodeURIComponent(senderId)}`
                : "/";

        event.waitUntil(

            clients.matchAll({
                type: "window",
                includeUncontrolled: true
            })

            .then(
                (clientList) => {

                    for (
                        const client
                        of clientList
                    ) {

                        if (
                            "focus" in client
                        ) {

                            client.focus();

                            if (
                                "navigate"
                                in client
                            ) {

                                return client.navigate(
                                    url
                                );

                            }

                            return;
                        }
                    }

                    if (
                        clients.openWindow
                    ) {

                        return clients.openWindow(
                            url
                        );

                    }
                }
            )
        );
    }
);
