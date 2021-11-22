import axios from "axios";

export function uiNewEvent(payload) {
    return {
        type: "UI_NEW_EVENT",
        payload,
    };
}

export function uiEvent(payload) {
    return {
        type: "UI_EVENT",
        payload,
    };
}

export function uiCalendar(payload) {
    return {
        type: "UI_CALENDAR",
        payload,
    };
}

export function uiAccount(payload) {
    return {
        type: "UI_ACCOUNT",
        payload,
    };
}

export function error(payload) {
    return {
        type: "ERROR",
        payload,
    };
}
