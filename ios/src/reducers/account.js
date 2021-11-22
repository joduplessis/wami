const initialState = {
  image: "avatar1.jpg",
  name: "Jo du Plessis",
  _id: null,
  color: "#2CD1C0",
  expert: false,
  status: "ONLINE",
  title: "Wamier!",
  timezone: "Africa/Johannesburg"
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case "ACCOUNT":
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

export default account;
