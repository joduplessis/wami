const initialState = [];

const tags = (state = initialState, action) => {
    switch (action.type) {
        case "TAGS":
            return action.payload;

        default:
            return state;
    }
};

export default tags;
