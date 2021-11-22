const initialState = [
    {
        _id: "",
        image: "",
        name: "Jo du Plessis",
        email: "jo@joduplessis.com",
        contact: "0814393685",
        amount: 500,
        description: "Some description",
    },
];

const transactions = (state = initialState, action) => {
    switch (action.type) {
        case "TRANSACTIONS":
            return action.payload;

        default:
            return state;
    }
};

export default transactions;
