const initialState = {
    event: false,
    calendar: false,
    account: false,
    error: null,
    new_event: null,
};

const common = (state = initialState, action) => {
    switch (action.type) {
        case "UI_EVENT":
            return Object.assign({}, state, {
                event: action.payload,
            });

        case "UI_NEW_EVENT":
            return Object.assign({}, state, {
                new_event: action.payload,
            });

        case "UI_CALENDAR":
            return Object.assign({}, state, {
                calendar: action.payload,
            });

        case "UI_ACCOUNT":
            return Object.assign({}, state, {
                account: action.payload,
            });

        case "ERROR":
            return Object.assign({}, state, {
                error: action.payload,
            });

        default:
            return state;
    }
};

export default common;
