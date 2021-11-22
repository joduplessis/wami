require("../../shim.js");
require("../../moment.js");

export function account(payload) {
  return {
    type: "ACCOUNT",
    payload
  };
}

export function accountUpdate(payload) {
  return {
    type: "ACCOUNT_UPDATE",
    payload
  };
}
