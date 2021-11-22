const initialState = [];

const channels = (state = initialState, action) => {
  switch (action.type) {
    case "CHANNELS":
      return action.payload;

    case "CHANNELS_ADD":
      return [...state, ...[action.payload]];

    case "CHANNELS_REMOVE":
      return [
        ...state.filter(channel => {
          return channel._id != action.payload;
        })
      ];

    case "CHANNELS_UPDATE":
      return [
        ...state.map((channel, _) => {
          return channel._id == action.payload._id
            ? {
                ...channel,
                ...action.payload
              }
            : channel;
        })
      ];

    case "CHANNELS_UPDATE_MEMBER_ADD":
      return [
        ...state.map((channel, _) => {
          return channel._id == action.payload.channel
            ? {
                ...channel,
                members: [...channel.members, ...[action.payload.member]]
              }
            : channel;
        })
      ];

    case "CHANNELS_UPDATE_MEMBER_REMOVE":
      return [
        ...state.map((channel, _) => {
          return channel._id == action.payload.channel
            ? {
                ...channel,
                members: channel.members.filter(member => {
                  return member._id != action.payload.member;
                })
              }
            : channel;
        })
      ];

    default:
      return state;
  }
};

export default channels;
