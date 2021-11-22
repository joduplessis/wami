import { API_PATH, GROUP, GQL } from "../helpers";
import { loading, error } from "./common";
import { util, fetchGroups, MQTT } from "../helpers";
import Realm from "realm";
import { UnreadSchema } from "../schemas";

export function hydrateGroups(id) {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().account;
      let groups = await GQL.fetchGroups(id, token);

      if (groups) {
        dispatch({
          type: "GROUPS",
          payload: groups
        });
      }

      for (let group of groups) {
        MQTT.subscribeToTopic(MQTT.topic(GROUP, group._id));
      }
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function hydrateGroup(id) {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().account;
      let group = await GQL.SYSTEM.fetchGroup(id, token);

      dispatch(addGroup(group));
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function addGroup(group) {
  return async (dispatch, getState) => {
    // Get the topic name
    MQTT.subscribeToTopic(MQTT.topic(GROUP, group._id));

    // Add it to our store
    dispatch({
      type: "GROUPS_ADD",
      payload: group
    });
  };
}

export function removeGroup(id) {
  return async (dispatch, getState) => {
    // remove
    MQTT.unsubscribeFromTopic(MQTT.topic(GROUP, id));

    // Remove our realm store
    Realm.open({
      schema: [UnreadSchema]
    })
      .then(realm => {
        realm.write(() => {
          // Get the group
          const group = realm
            .objects("Unread")
            .filtered(`kind == "GROUP" && _id == "${id}"`);

          // Delete the group
          realm.delete(group);

          // Now remove it from our store
          dispatch({
            type: "GROUPS_REMOVE",
            payload: id
          });
        });
      })
      .catch(error => {
        dispatch(error(error));
      });
  };
}

export function updateGroup(partialGroup) {
  return {
    type: "GROUPS_UPDATE",
    payload: partialGroup
  };
}

export function updateGroupRemoveMember(groupMember) {
  return {
    type: "GROUPS_UPDATE_MEMBER_REMOVE",
    payload: groupMember
  };
}

export function updateGroupAddMember(groupMember) {
  return {
    type: "GROUPS_UPDATE_MEMBER_ADD",
    payload: groupMember
  };
}
