const initialState = [
    {
        id: 0,
        name: "Jo du Plessis",
        title: "Hey, this is an event",
        start: "2018-10-3T10:00:00.511Z",
        end: "2018-10-3T10:30:00.511Z",
        color: "#ED4A70",
    },
    {
        id: 0,
        name: "Jo du Plessis",
        title: "This is another event",
        start: "2018-10-2T10:00:00.511Z",
        end: "2018-10-2T11:00:00.511Z",
        color: "#fcc34b",
        processed: true,
        confirmed: true,
    },
    {
        id: 0,
        name: "Jo du Plessis",
        title: "This is another event",
        start: "2018-10-2T09:30:00.511Z",
        end: "2018-10-2T10:00:00.511Z",
        color: "#EF6C31",
    },
    {
        id: 0,
        name: "Jo du Plessis",
        title: "The 3rd event here",
        start: "2018-10-5T09:30:00.511Z",
        end: "2018-10-5T10:30:00.511Z",
        color: "#6DB9BD",
    },
    {
        id: 0,
        name: "Jo du Plessis",
        title: "And the final one",
        start: "2018-10-4T10:30:00.511Z",
        end: "2018-10-4T11:00:00.511Z",
        color: "#20A0FF",
    },
];

const events = (state = initialState, action) => {
    switch (action.type) {
        case "EVENTS":
            return action.payload;

        case "EVENTS_UPDATE":
            return [
                ...state.map((event, _) => {
                    return event._id == action.payload._id
                        ? {
                              ...event,
                              ...action.payload,
                          }
                        : event;
                }),
            ];

        case "EVENTS_ADD":
            return [...state, action.payload];
            break;

        default:
            return state;
    }
};

export default events;
