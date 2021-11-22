import { combineReducers } from "redux";
import common from "./common";
import events from "./events";
import messages from "./messages";
import contacts from "./contacts";
import groups from "./groups";
import channels from "./channels";
import thread from "./thread";
import account from "./account";

const rootReducer = combineReducers({
  common,
  events,
  messages,
  contacts,
  groups,
  channels,
  thread,
  account
});

export default rootReducer;
