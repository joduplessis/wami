const initialState = [];

const events = (state = initialState, action) => {
  switch (action.type) {
    case "EVENTS":
      return action.payload;

    case "EVENTS_ADD":
      return [...state, ...[action.payload]];

    case "EVENTS_REMOVE":
      return [
        ...state.filter(event => {
          return event._id != action.payload;
        })
      ];

    case "EVENTS_UPDATE":
      return [
        ...state.map((event, _) => {
          return event._id == action.payload._id
            ? {
                ...event,
                ...action.payload
              }
            : event;
        })
      ];

    case "EVENTS_UPDATE_ATTENDEE":
      return [
        ...state.map((event, _) => {
          return event._id == action.payload.event
            ? {
                ...event,
                attendees: event.attendees.map(attendee => {
                  return attendee.user._id == action.payload.attendee
                    ? {
                        ...attendee,
                        ...{ status: action.payload.status }
                      }
                    : attendee;
                })
              }
            : event;
        })
      ];

    case "EVENTS_UPDATE_ATTENDEE_ADD":
      return [
        ...state.map((event, _) => {
          return event._id == action.payload.event
            ? {
                ...event,
                attendees: [...event.attendees, ...[action.payload.attendee]]
              }
            : event;
        })
      ];

    case "EVENTS_UPDATE_ATTENDEE_REMOVE":
      return [
        ...state.map((event, _) => {
          return event._id == action.payload.event
            ? {
                ...event,
                attendees: event.attendees.filter(attendee => {
                  return attendee.user._id != action.payload.attendee;
                })
              }
            : event;
        })
      ];

    default:
      return state;
  }
};

export default events;
