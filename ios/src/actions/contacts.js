import { API_PATH, CONTACT, GQL } from "../helpers";
import { loading, error } from "./common";
import { util, fetchContacts, MQTT } from "../helpers";
import Realm from "realm";
import { UnreadSchema } from "../schemas";
import { Alert } from "react-native";

export function hydrateContacts(id) {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().account;
      let contacts = await GQL.fetchContacts(id, token);

      if (contacts) {
        dispatch({
          type: "CONTACTS",
          payload: contacts
        });
      }

      for (let contact of contacts) {
        MQTT.subscribeToTopic(MQTT.topic(CONTACT, contact._id));
      }
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function hydrateContact(id) {
  return async (dispatch, getState) => {
    try {
      // If there is a contact with this id
      // Then return null
      if (
        getState()
          .contacts.filter((contact, _) => {
            return contact._id == id;
          })
          .flatten()
      ) {
        return null;
      }

      const { token } = getState().account;
      let contact = await GQL.SYSTEM.fetchContact(id, token);

      dispatch(addContact(contact));
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function addContact(contact) {
  return async (dispatch, getState) => {
    const _id = contact._id;
    const kind = CONTACT;
    const count = 0;

    // Get the topic name
    MQTT.subscribeToTopic(MQTT.topic(CONTACT, contact._id));

    // Tell them
    if (contact.contact._id == getState().account._id) {
      Alert.alert(
        "Congratulations",
        "You have a new client! Check your message panel!"
      );
    }

    // Add the Realm thread
    Realm.open({
      schema: [UnreadSchema]
    })
      .then(realm => {
        const unreadThreads = realm
          .objects("Unread")
          .filtered(`kind == "${kind}" && _id == "${_id}"`);

        // Take only 1
        const unreadThread = unreadThreads[0];

        // If there is none, we add it
        if (!unreadThread) {
          realm.write(() => {
            realm.create("Unread", {
              _id,
              kind,
              last: "",
              count
            });
          });
        }
      })
      .catch(err => {
        this.props.updateError(err);
      });

    dispatch({
      type: "CONTACTS_ADD",
      payload: contact
    });
  };
}

export function removeContact(id) {
  return async (dispatch, getState) => {
    // remove
    MQTT.unsubscribeFromTopic(MQTT.topic(CONTACT, id));

    // Remove our realm store
    Realm.open({
      schema: [UnreadSchema]
    })
      .then(realm => {
        realm.write(() => {
          // Get the channel
          const contact = realm
            .objects("Unread")
            .filtered(`kind == "CONTACT" && _id == "${id}"`);

          // Delete the channel
          realm.delete(contact);

          // Now remove it from our store
          dispatch({
            type: "CONTACTS_REMOVE",
            payload: id
          });
        });
      })
      .catch(error => {
        dispatch(error(error));
      });
  };
}

export function updateContact(partialContact) {
  return {
    type: "CONTACTS_UPDATE",
    payload: partialContact
  };
}

export function updateContactStatus(partialContactStatus) {
  return {
    type: "CONTACTS_UPDATE_STATUS",
    payload: partialContactStatus
  };
}
