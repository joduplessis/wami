const initialState = {};

/*
{
    date: "2018-10-03",
    view: "week",
    start: "9:00",
    end: "15:00",
    interval: 30,
    height: 20,
    daybreak: "05:00",
    days: ["MONDAY","TUESDAY","FRIDAY"],
    timezone: 'Africa/Johannesburg'
};
*/

const calendar = (state = initialState, action) => {
    switch (action.type) {
        case "CALENDAR":
            return action.payload;

        case "CALENDAR_UPDATE":
            return Object.assign({}, state, {
                ...state,
                ...action.payload,
            });
            break;

        case "CALENDAR_DATE":
            return Object.assign({}, state, {
                date: action.payload,
            });

        case "CALENDAR_VIEW":
            return Object.assign({}, state, {
                view: action.payload,
            });

        default:
            return state;
    }
};

export default calendar;
