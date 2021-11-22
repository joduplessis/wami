const initialState = [];

const common = (state = initialState, action) => {
  switch (action.type) {
    case "MESSAGES":
      return action.payload;

    case "MESSAGES_ADD":
      return [...state, ...[action.payload]];

    case "MESSAGES_UPDATE":
      return [
        ...state.map((message, _) => {
          return message._id == action.payload._id
            ? {
                ...message,
                ...action.payload
              }
            : message;
        })
      ];

    case "MESSAGES_UPDATE_REACTION_ADD":
      return [
        ...state.map((message, _) => {
          return message._id == action.payload.message
            ? {
                ...message,
                reactions: [...message.reactions, ...[action.payload.reaction]]
              }
            : message;
        })
      ];

    case "MESSAGES_UPDATE_REACTION_REMOVE":
      return [
        ...state.map((message, _) => {
          return message._id == action.payload.message
            ? {
                ...message,
                reactions: message.reactions.filter(reaction => {
                  return reaction != action.payload.reaction;
                })
              }
            : message;
        })
      ];

    default:
      return state;
  }
};

export default common;
