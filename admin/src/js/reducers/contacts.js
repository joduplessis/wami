const initialState = [];

const contacts = (state = initialState, action) => {
    switch (action.type) {
        case "CONTACTS":
            return action.payload;

        default:
            return state;
    }
};

export default contacts;
