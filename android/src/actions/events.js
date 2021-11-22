import { API_PATH, EVENT, GQL } from "../helpers";
import { Alert } from "react-native";
import { loading, error } from "./common";
import { util, fetchEvents, MQTT } from "../helpers";

export function hydrateEvents(id) {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().account;
      let events = await GQL.fetchEvents(id, token);

      dispatch({
        type: "EVENTS",
        payload: events
      });

      for (let event of events) {
        MQTT.subscribeToTopic(MQTT.topic(EVENT, event._id));
      }
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function hydrateEvent(id) {
  return async (dispatch, getState) => {
    // If there is a event with this id
    // Then return null
    if (
      getState()
        .events.filter((event, _) => {
          return event._id == id;
        })
        .flatten()
    ) {
      return null;
    }

    // Specific to events
    // These will be added by the API, requested by other users
    // Special instance
    Alert.alert("A new appointment has been added for you!");

    try {
      const { token } = getState().account;
      let event = await GQL.SYSTEM.fetchEvent(id, token);

      dispatch(addEvent(event));
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function addEvent(event) {
  return async (dispatch, getState) => {
    // Get the topic name
    MQTT.subscribeToTopic(MQTT.topic(EVENT, event._id));

    dispatch({
      type: "EVENTS_ADD",
      payload: event
    });
  };
}

export function removeEvent(id) {
  return async (dispatch, getState) => {
    // Remove sub
    MQTT.unsubscribeFromTopic(MQTT.topic(EVENT, id));

    dispatch({
      type: "EVENTS_REMOVE",
      payload: id
    });
  };
}

export function updateEvent(partialEvent) {
  return {
    type: "EVENTS_UPDATE",
    payload: partialEvent
  };
}

export function updateEventAttendee(eventAttendee) {
  return {
    type: "EVENTS_UPDATE_ATTENDEE",
    payload: eventAttendee
  };
}

export function updateEventRemoveAttendee(eventAttendee) {
  return {
    type: "EVENTS_UPDATE_ATTENDEE_REMOVE",
    payload: eventAttendee
  };
}

export function updateEventAddAttendee(eventAttendee) {
  return {
    type: "EVENTS_UPDATE_ATTENDEE_ADD",
    payload: eventAttendee
  };
}
