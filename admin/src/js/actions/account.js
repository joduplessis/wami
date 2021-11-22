import axios from "axios";

export function account(payload) {
    return {
        type: "ACCOUNT",
        payload,
    };
}

export function updateAccount(payload) {
    return {
        type: "ACCOUNT_UPDATE",
        payload,
    };
}
