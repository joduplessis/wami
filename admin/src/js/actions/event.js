import axios from "axios";

export function event(payload) {
    return {
        type: "EVENT",
        payload,
    };
}

export function updateEvent(payload) {
    return {
        type: "EVENT_UPDATE",
        payload,
    };
}
