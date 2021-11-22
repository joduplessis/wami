const initialState = {
  name: null,
  title: null,
  image: null,
  color: null,
  kind: null,
  _id: null,
  topic: null
};

const thread = (state = initialState, action) => {
  switch (action.type) {
    case "THREAD":
      return action.payload;

    default:
      return state;
  }
};

export default thread;
