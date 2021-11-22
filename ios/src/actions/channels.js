import { API_PATH, CHANNEL, GQL } from "../helpers";
import { loading, error } from "./common";
import { MQTT } from "../helpers";
import Realm from "realm";
import { UnreadSchema } from "../schemas";

export function hydrateChannels(id) {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().account;
      let channels = await GQL.fetchChannels(id, token);

      if (channels) {
        dispatch({
          type: "CHANNELS",
          payload: channels
        });
      }

      for (let channel of channels) {
        MQTT.subscribeToTopic(MQTT.topic(CHANNEL, channel._id));
      }
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function hydrateChannel(id) {
  return async (dispatch, getState) => {
    try {
      // If there is a channel with this id
      // Then return null
      if (
        getState()
          .channels.filter((channel, _) => {
            return channel._id == id;
          })
          .flatten()
      ) {
        return null;
      }

      const { token } = getState().account;
      let channel = await GQL.SYSTEM.fetchChannel(id, token);

      dispatch(addChannel(channel));
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function addChannel(channel) {
  return async (dispatch, getState) => {
    // Get the topic name
    MQTT.subscribeToTopic(MQTT.topic(CHANNEL, channel._id));

    // Update our store!
    dispatch({
      type: "CHANNELS_ADD",
      payload: channel
    });
  };
}

export function removeChannel(id) {
  return async (dispatch, getState) => {
    // remove
    MQTT.unsubscribeFromTopic(MQTT.topic(CHANNEL, id));

    // Remove our realm store
    Realm.open({
      schema: [UnreadSchema]
    })
      .then(realm => {
        realm.write(() => {
          // Get the channel
          const channel = realm
            .objects("Unread")
            .filtered(`kind == "CHANNEL" && _id == "${id}"`);

          // Delete the channel
          realm.delete(channel);

          // Now remove it from our store
          dispatch({
            type: "CHANNELS_REMOVE",
            payload: id
          });
        });
      })
      .catch(error => {
        dispatch(error(error));
      });
  };
}

export function updateChannel(partialChannel) {
  return {
    type: "CHANNELS_UPDATE",
    payload: partialChannel
  };
}

export function updateChannelRemoveMember(channelMember) {
  return {
    type: "CHANNELS_UPDATE_MEMBER_REMOVE",
    payload: channelMember
  };
}

export function updateChannelAddMember(channelMember) {
  return {
    type: "CHANNELS_UPDATE_MEMBER_ADD",
    payload: channelMember
  };
}
