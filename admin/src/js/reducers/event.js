const initialState = {};

const event = (state = initialState, action) => {
    switch (action.type) {
        case "EVENT":
            return action.payload;

        case "EVENT_UPDATE":
            return Object.assign({}, state, {
                ...state,
                ...action.payload,
            });

        default:
            return state;
    }
};

export default event;
