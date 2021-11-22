const initialState = {};

const account = (state = initialState, action) => {
    switch (action.type) {
        case "ACCOUNT":
            return Object.assign({}, state, action.payload);

        case "ACCOUNT_UPDATE":
            return Object.assign({}, state, {
                ...state,
                ...action.payload,
            });

        default:
            return state;
    }
};

export default account;
