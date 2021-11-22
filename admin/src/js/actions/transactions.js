import axios from "axios";

export function transactions(payload) {
    return {
        type: "TRANSACTIONS",
        payload,
    };
}
