export const MQTT = {
    dispatch: (topic, action) => {
        if (global.mqtt) {
            console.log(
                "MQTT message sent to ",
                '"' + topic + '"',
                JSON.stringify(action)
            );

            global.mqtt.publish(
                topic.toString(),
                JSON.stringify(action),
                {
                    qos: 2,
                },
                (err) => {
                    if (err) {
                        console.log("Error: ", err);
                    }
                }
            );
        } else {
            console.log("MQTT not connected");
        }
    },

    topic: (kind, id) => {
        return `${kind}/${id}`;
    },
};
