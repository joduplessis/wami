const initialState = {
  error: null,
  menu: false,
  loading: false,
  connected: true,
  token: "",
  app_state: "foreground",
  tags: []
};

const common = (state = initialState, action) => {
  switch (action.type) {
    case "ERROR":
      return Object.assign({}, state, {
        error: action.payload
      });
    case "MENU":
      return Object.assign({}, state, {
        menu: action.payload
      });
    case "LOADING":
      return Object.assign({}, state, {
        loading: action.payload
      });
    case "CONNECTED":
      return Object.assign({}, state, {
        connected: action.payload
      });
    case "APP_STATE":
      return Object.assign({}, state, {
        app_state: action.payload
      });
    case "TOKEN":
      return Object.assign({}, state, {
        token: action.payload
      });
    case "TAGS":
      return Object.assign({}, state, {
        tags: action.payload
      });
    default:
      return state;
  }
};

export default common;
