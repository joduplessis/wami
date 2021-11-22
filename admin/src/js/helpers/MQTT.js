export const MQTT = {
    topic: (kind, id) => {
        return `${kind}/${id}`;
    },

    unsubscribeFromTopic: (topic) => {
        if (global.mqtt) {
            global.mqtt.unsubscribe(topic);
        }
    },

    subscribeToTopic: (topic) => {
        if (topic != "" && topic) {
            if (global.mqtt) {
                console.log("Subscribing to", topic);
                global.mqtt.subscribe(
                    topic,
                    {
                        qos: 2,
                    },
                    (err) => {
                        if (err) {
                            console.log("Error: ", err);
                        }
                    }
                );
            }
        }
    },

    dispatch: (topic, action) => {
        if (global.mqtt) {
            global.mqtt.publish(
                topic,
                JSON.stringify({
                    ...action,
                    sender: global._id,
                }),
                {
                    qos: 2,
                },
                (err) => {
                    if (err) {
                        console.log("Error: ", err);
                    }
                }
            );
        }
    },
};
