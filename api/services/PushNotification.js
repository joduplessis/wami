import OneSignal from "onesignal-node";

export default class PushNotification {
    constructor() {
        if (this.osClient) return;

        this.client = new OneSignal.Client({
            userAuthKey: process.env.OS_USER_AUTH_KEY,
            app: {
                appAuthKey: process.env.OS_APP_AUTH_KEY,
                appId: process.env.OS_APP_ID,
            },
        });
    }

    send(message, device) {
        const notification = new OneSignal.Notification({
            content_available: true,
            contents: { en: message },
            include_player_ids: [device],
        });

        // Send the actual message
        this.client.sendNotification(
            notification,
            (error, httpResponse, data) => {
                if (error) {
                    console.log("Something went wrong...", error);
                } else {
                    console.log("Sent", data, httpResponse.statusCode);
                }
            }
        );
    }
}
