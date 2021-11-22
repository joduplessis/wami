import axios from "axios";

export function contacts(payload) {
    return {
        type: "CONTACTS",
        payload,
    };
}
