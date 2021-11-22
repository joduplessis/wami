import axios from "axios";

export function events(events) {
    return {
        type: "EVENTS",
        payload: events,
    };
}

export function updateEvents(partialEvent) {
    return {
        type: "EVENTS_UPDATE",
        payload: partialEvent,
    };
}

export function addEvents(event) {
    return {
        type: "EVENTS_ADD",
        payload: event,
    };
}
