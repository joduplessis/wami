const initialState = [];

const groups = (state = initialState, action) => {
  switch (action.type) {
    case "GROUPS":
      return action.payload;

    case "GROUPS_ADD":
      return [...state, ...[action.payload]];

    case "GROUPS_REMOVE":
      return [
        ...state.filter(group => {
          return group._id != action.payload;
        })
      ];

    case "GROUPS_UPDATE":
      return [
        ...state.map((group, _) => {
          return group._id == action.payload._id
            ? {
                ...group,
                ...action.payload
              }
            : group;
        })
      ];

    case "GROUPS_UPDATE_MEMBER_ADD":
      return [
        ...state.map((group, _) => {
          return group._id == action.payload.group
            ? {
                ...group,
                members: [...group.members, ...[action.payload.member]]
              }
            : group;
        })
      ];

    case "GROUPS_UPDATE_MEMBER_REMOVE":
      return [
        ...state.map((group, _) => {
          return group._id == action.payload.group
            ? {
                ...group,
                members: group.members.filter(member => {
                  return member._id != action.payload.member;
                })
              }
            : group;
        })
      ];

    default:
      return state;
  }
};

export default groups;
