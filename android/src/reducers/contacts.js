const initialState = [];

const contacts = (state = initialState, action) => {
  switch (action.type) {
    case "CONTACTS":
      return action.payload;

    case "CONTACTS_ADD":
      return [...state, ...[action.payload]];

    case "CONTACTS_REMOVE":
      return [
        ...state.filter(contact => {
          return contact._id != action.payload;
        })
      ];

    case "CONTACTS_UPDATE":
      return [
        ...state.map((contact, _) => {
          if (contact._id == action.payload._id) {
            if (contact.user._id == action.payload.user._id) {
              return {
                ...contact,
                user: action.payload.user
              };
            }

            if (contact.contact._id == action.payload.user._id) {
              return {
                ...contact,
                contact: action.payload.user
              };
            }
          } else {
            return contact;
          }
        })
      ];

    case "CONTACTS_UPDATE_STATUS":
      return [
        ...state.map((contact, _) => {
          return contact._id == action.payload.contact
            ? {
                ...contact,
                ...{ confirmed: action.payload.confirmed }
              }
            : contact;
        })
      ];

    default:
      return state;
  }
};

export default contacts;
