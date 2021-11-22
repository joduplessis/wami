require("../../shim.js");
require("../../moment.js");

import { Alert } from "react-native";
import {
  CONTACT,
  EVENT,
  CHANNEL,
  MQTT_PATH,
  GQL,
  MQTT,
  EventFactory,
  updateOffline,
  updateDevice
} from "../helpers";
import {
  hydrateContacts,
  hydrateContact,
  removeContact,
  hydrateGroup,
  hydrateGroups,
  removeGroup,
  hydrateChannel,
  hydrateChannels,
  removeChannel,
  hydrateEvent,
  hydrateEvents,
  removeEvent,
  hydrateMessage
} from "./";
import mqtt from "mqtt";
import OneSignal from "react-native-onesignal";
import { navigate } from "../helpers/NavigationService";
import BackgroundFetch from "react-native-background-fetch";

function onesignalReceived(notification) {
  console.log("Notification received: ", notification);
}

function onesignalOpened(openResult) {
  console.log("Message: ", openResult.notification.payload.body);
  console.log("Data: ", openResult.notification.payload.additionalData);
  console.log("isActive: ", openResult.notification.isAppInFocus);
  console.log("openResult: ", openResult);

  // NB: Ideally MQTT will make sure of deliverability
  // So a backup of WebRTC notifications should propagate and kick off
  // the call procedure
}

export function hydrations(_id, jwtToken) {
  return (dispatch, getState) => {
    // Hydrations
    dispatch(hydrateTags());
    dispatch(hydrateContacts(_id));
    dispatch(hydrateGroups(_id));
    dispatch(hydrateChannels(_id));
    dispatch(hydrateEvents(_id));

    // Do the subscriptions
    MQTT.subscribeToTopic(_id);

    // Update the device for Push messages
    OneSignal.init("d1554ff2-c2ab-4533-b97c-e600df837010");
    OneSignal.addEventListener("received", onesignalReceived);
    OneSignal.addEventListener("opened", onesignalOpened);
    OneSignal.addEventListener("ids", device => {
      console.log(
        "User subscribed to OneSignal (now updating their device in DB)",
        device.userId
      );
      console.log(jwtToken);

      updateDevice(_id, jwtToken, device.userId);
    });

    OneSignal.configure();
  };
}

export function dehydrations(_id) {
  return (dispatch, getState) => {
    // Unsub from One Signal
    OneSignal.removeEventListener("received", onesignalReceived);
    OneSignal.removeEventListener("opened", onesignalOpened);
    OneSignal.removeEventListener("ids", device => {});

    // Unsubscribe from our own ID
    MQTT.unsubscribeFromTopic(_id);

    // Unsubscribe from our contacts
    getState().contacts.map((contact, _) => {
      MQTT.unsubscribeFromTopic(MQTT.topic(CONTACT, contact._id));
    });

    // Unsubscribe from our events
    getState().events.map((event, _) => {
      MQTT.unsubscribeFromTopic(MQTT.topic(EVENT, event._id));
    });

    // Unsubscribe from our channels
    getState().channels.map((channel, _) => {
      MQTT.unsubscribeFromTopic(MQTT.topic(CHANNEL, channel._id));
    });

    if (global.mqtt) {
      global.mqtt.end();
    }
  };
}

export function initialize() {
  return async (dispatch, getState) => {
    let cache;
    const { _id, token } = getState().account;

    // Default
    dispatch(connected(true));

    // Do some checks
    if (!_id) return;
    if (global.mqtt) return;
    if (global.connection) return;

    // Hydrate shit
    dispatch(hydrations(_id, token));

    // This only gets set if everything is good to go
    dispatch(connected(false));

    const client = mqtt.connect(MQTT_PATH, {
      clean: false,
      queueQoSZero: true,
      useSSL: false,
      clientId: _id,
      will: {
        topic: "death",
        payload: _id
      }
    });

    global.connection = true;

    client.on("disconnect", e => dispatch(connected(false)));
    client.on("close", e => console.log("Closed MQTT connection", e));
    client.on("connect", () => {
      console.log("Connected to broker.");

      // Always be available
      global.mqtt = client;

      // Tell everyone we're live
      dispatch(connected(true));

      // If this user is logged in, then resubscribe
      if (getState().account._id && getState().account.token)
        dispatch(hydrations(getState().account._id, getState().account.token));
    });

    // Now subs
    client.on("message", (topic, data) => {
      // Get a string version of the data
      const payload = data.toString();

      // Save it to our cache
      // So we can avoid double deliveries
      if (cache == payload) return;
      if (cache != payload) cache = payload;

      // This looks like the payload dispatched to the store
      // It's straight from Redux
      const action = JSON.parse(payload);

      // Debug
      console.log("Received from MQTT broker: ", topic, payload);

      // If this is null, then do nothing
      if (!action.type) return;

      // Only process the message we didn't send
      // if (action.sender == _id) return;
      // These message are sent from the API
      // We need to process these specifically
      switch (topic) {
        // These receive all adds/removes for subscriptions
        // They are sent by the API
        case _id:
          // If not - carry on!
          switch (action.type) {
            case "WEBRTC_REQUEST":
              EventFactory.get().emit("request", action.payload);
              break;

            case "WEBRTC_ACCEPT":
              EventFactory.get().emit("accept", {});
              break;

            case "WEBRTC_END":
              EventFactory.get().emit("end", {});
              break;

            case "WEBRTC_DECLINE":
              EventFactory.get().emit("decline", {});
              break;

            case "WEBRTC_OFFER":
              EventFactory.get().emit("offer", action.payload);
              break;

            case "WEBRTC_ANSWER":
              EventFactory.get().emit("answer", action.payload);
              break;

            case "WEBRTC_CANDIDATE":
              EventFactory.get().emit("candidate", action.payload);
              break;

            case "CHANNELS_ADD":
              dispatch(hydrateChannel(action.payload));
              break;

            case "CHANNELS_REMOVE":
              dispatch(removeChannel(action.payload));
              break;

            case "CONTACTS_ADD":
              dispatch(hydrateContact(action.payload));
              break;

            case "CONTACTS_REMOVE":
              dispatch(removeContact(action.payload));
              break;

            case "EVENTS_ADD":
              dispatch(hydrateEvent(action.payload));
              break;

            case "EVENTS_REMOVE":
              dispatch(removeEvent(action.payload));
              break;

            case "GROUPS_ADD":
              dispatch(hydrateGroup(action.payload));
              break;

            case "GROUPS_REMOVE":
              dispatch(removeGroup(action.payload));
              break;
          }
          break;

        // All other message, we dispatch directly to the store
        // They will be updates & comm related messaged
        default:
          // We need to handle new message distinctly
          // We want to inc/dec unread count and possibly not add it to the
          // store if it's not being sent to the currect thread
          if (action.type == "MESSAGES_ADD") {
            // If we did not send this message
            // Our cache check will ensure this doesn't get done twice
            if (action.sender != getState().account._id) {
              dispatch(hydrateMessage(topic, action));
            }
          } else {
            // Only process the messages we didn't send
            if (action.sender != getState().account._id) {
              // Special cases we want alert the user
              switch (action.type) {
                case "EVENTS_UPDATE_ATTENDEE":
                  Alert.alert(
                    "Appointment Updated",
                    "A user has responded to an event!"
                  );
                  break;
              }

              // Everything else we do normally
              dispatch(action);
            }
          }
      }
    });
  };
}

export function hydrateTags() {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().account;
      let tags = await GQL.fetchTags(token);

      dispatch({
        type: "TAGS",
        payload: tags
      });
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function tags(payload) {
  return {
    type: "TAGS",
    payload
  };
}

export function loading(payload) {
  return {
    type: "LOADING",
    payload
  };
}

export function error(payload) {
  console.log(payload);

  return {
    type: "ERROR",
    payload
  };
}

export function menu(payload) {
  return {
    type: "MENU",
    payload
  };
}

export function appState(payload) {
  return (dispatch, getState) => {
    const { token, _id } = getState().account;

    // Update the status of the user
    // Payload = background OR active
    updateOffline(_id, token, payload);

    // Update the state
    dispatch({ type: "APP_STATE", payload });
  };
}

export function connected(payload) {
  return {
    type: "CONNECTED",
    payload
  };
}

export function token(payload) {
  return {
    type: "TOKEN",
    payload
  };
}
