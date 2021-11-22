import axios from "axios";
import {
    DEFAULT_DATE,
    DEFAULT_VIEW,
    DEFAULT_HEIGHT,
    DEFAULT_SETTINGS_OPEN,
} from "../helpers";

export function calendar(payload) {
    const {
        _id,
        start,
        end,
        interval,
        daybreak,
        days,
        timezone,
        address,
        location,
    } = payload;

    return {
        type: "CALENDAR",
        payload: {
            _id,
            date: DEFAULT_DATE,
            view: DEFAULT_VIEW,
            height: DEFAULT_HEIGHT,
            settings: DEFAULT_SETTINGS_OPEN,
            start,
            end,
            interval,
            daybreak,
            days,
            timezone,
            address,
            location,
        },
    };
}

export function updateCalendar(payload) {
    return {
        type: "CALENDAR_UPDATE",
        payload,
    };
}

export function updateDate(payload) {
    return {
        type: "CALENDAR_DATE",
        payload,
    };
}

export function updateView(payload) {
    return {
        type: "CALENDAR_VIEW",
        payload,
    };
}
