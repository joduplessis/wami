import { combineReducers } from "redux";
import common from "./common";
import calendar from "./calendar";
import events from "./events";
import contacts from "./contacts";
import account from "./account";
import tags from "./tags";
import transactions from "./transactions";
import event from "./event";

const rootReducer = combineReducers({
    common,
    calendar,
    events,
    event,
    contacts,
    tags,
    transactions,
    account,
});

export default rootReducer;
