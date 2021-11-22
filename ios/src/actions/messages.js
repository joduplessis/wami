import { Alert, Vibration } from "react-native";
import { API_PATH, MQTT, GQL } from "../helpers";
import { loading, error, menu } from "./common";
import Realm from "realm";
import { UnreadSchema } from "../schemas";

const moment = require("moment-timezone");

export function hydrateMessages(thread) {
  return async (dispatch, getState) => {
    dispatch({
      type: "MESSAGES",
      payload: []
    });

    try {
      const { token } = getState().account;
      let messages = await GQL.fetchMessages(thread.topic, token);

      if (messages) {
        dispatch({
          type: "MESSAGES",
          payload: messages
        });
      }
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function hydrateMessage(topic, action) {
  return async (dispatch, getState) => {
    // Notify the user if we are background
    // NB: This doesn't work outside of being in dev mode
    // NB: We can potentially get rid of this if we use Firebase
    /* 
        if (getState().common.app_state == "background") {
            PushNotificationIOS.presentLocalNotification({
                alertTitle: action.payload.sender.name,
                alertBody: action.payload.text,
            });
        }
        */

    // NB: We can potentially get rid of this if we use Firebase
    // If the user is not on the current thread
    // Notify them that they have received another message
    if (topic != getState().thread.topic) Vibration.vibrate(2000);

    dispatch(addMessage(action.payload));
  };
}

export function addMessage(message) {
  return async (dispatch, getState) => {
    const topicArray = message.topic.split("/");
    const kind = topicArray[0];
    const _id = topicArray[1];

    // When we receive a message that is currently out of view,
    // then add to the thread list
    Realm.open({
      schema: [UnreadSchema]
    }).then(realm => {
      // Get all records that are this message kind/ message id
      const unreadThreads = realm
        .objects("Unread")
        .filtered(`kind == "${kind}" && _id == "${_id}"`);

      // Take only 1
      const unreadThread = unreadThreads[0];
      const last = `${message.sender.name.split(" ")[0]}: ${message.text}`;

      // If there is none, we add it
      if (!unreadThread) {
        realm.write(() => {
          realm.create("Unread", {
            _id,
            kind,
            last,
            count: message.topic != getState().thread.topic ? 1 : 0
          });
        });
      } else {
        // Othwerwise we update it
        realm.write(() => {
          unreadThread.count =
            message.topic != getState().thread.topic
              ? unreadThread.count + 1
              : 0;
          unreadThread.last = last;
        });
      }

      // NB: We can potentially get rid of this if we use Firebase
      // Only process this if we are not the sender
      // And if the user is on the current thread of the messgae
      if (message.topic == getState().thread.topic) {
        dispatch(addMessageBase(message));
      }
    });
  };
}

export function addMessageBase(message) {
  return {
    type: "MESSAGES_ADD",
    payload: message
  };
}

export function updateMessage(partialMessage) {
  return {
    type: "MESSAGES_UPDATE",
    payload: partialMessage
  };
}

export function updateMessageAddReaction(partialMessage) {
  return {
    type: "MESSAGES_UPDATE_REACTION_ADD",
    payload: partialMessage
  };
}

export function updateMessageRemoveReaction(partialMessage) {
  return {
    type: "MESSAGES_UPDATE_REACTION_REMOVE",
    payload: partialMessage
  };
}
