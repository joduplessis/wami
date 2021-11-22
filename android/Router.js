require("./shim.js");
require("./moment.js");

import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { View, Dimensions } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  MessagingScreen,
  ProfileScreen,
  SignupScreen,
  SigninScreen,
  ForgottenPasswordScreen,
  ExpertsScreen,
  MainScreen,
  TransactionsScreen,
  MapScreen,
  EventsScreen,
  TagScreen,
  SearchScreen,
  UserDetailsScreen,
  MessagesScreen
} from "./src/screens";
import { LoadingPartial, ErrorPartial, ConnectedPartial } from "./src/partials";
import {
  menu,
  error,
  loading,
  unread,
  addThread,
  removeThread,
  addMessage,
  removeMessageReaction,
  addMessageReaction,
  appState,
  connected,
  hydrateTags,
  hydrateContacts,
  hydrateGroups,
  hydrateChannels,
  hydrateEvents
} from "./src/actions";
import Icon from "react-native-vector-icons/Feather";
import NavigationService from "./src/helpers/NavigationService";

const TabNavigation = createBottomTabNavigator(
  {
    Messages: {
      screen: MessagesScreen
    },
    Sessions: {
      screen: EventsScreen
    },
    Discover: {
      screen: MainScreen
    },
    Account: {
      screen: ProfileScreen
    },
    Find: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: "Messages",
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        let iconName;

        switch (routeName) {
          case "Discover":
            iconName = "compass";
            break;
          case "Sessions":
            iconName = "calendar";
            break;
          case "Find":
            iconName = "map";
            break;
          case "Account":
            iconName = "settings";
            break;
          case "Messages":
            iconName = "message-circle";
            break;
        }

        return <Icon name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "#1F2D3D",
      inactiveTintColor: "#C5C5D2",
      showLabel: false,
      style: {
        height: 65,
        backgroundColor: "white",
        //borderTopColor: '#EEF1F7',
        borderTopColor: "white",
        borderTopWidth: 0,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 5
        },
        shadowRadius: 20,
        shadowOpacity: 0.15
      },
      labelStyle: {
        fontFamily: "Avenir",
        fontSize: 13,
        paddingBottom: 5
      },
      tabStyle: {
        paddingTop: 0,
        borderTopWidth: 2,
        borderColor: "#EEF1F7",
        borderTopColor: "white",
        borderTopWidth: 0
      }
    }
  }
);

const WamiApp = createStackNavigator(
  {
    Signin: {
      screen: SigninScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    ForgottenPassword: {
      screen: ForgottenPasswordScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Main: {
      screen: TabNavigation,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Experts: {
      screen: ExpertsScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Tag: {
      screen: TagScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Messaging: {
      screen: MessagingScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    UserDetails: {
      screen: UserDetailsScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Transactions: {
      screen: TransactionsScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    }
  },
  {
    initialRouteName: "Signin"
  }
);

class RouterRC extends Component {
  constructor(props) {
    super(props);

    this.menuCallback = this.menuCallback.bind(this);
  }

  componentDidMount() {}

  menuCallback(open) {
    this.props.menuAction(open);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WamiApp
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />

        {/*
                <ConnectedPartial
                    visible={!this.props.common.connected}
                />
                */}

        <ErrorPartial visible={this.props.common.error} />

        <LoadingPartial visible={this.props.common.loading} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  events: state.events,
  thread: state.thread,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  menuAction: payload => {
    dispatch(menu(payload));
  },

  updateConnected: payload => {
    dispatch(connected(payload));
  },

  updateAppState: payload => {
    dispatch(appState(payload));
  },

  updateError: payload => {
    dispatch(error(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  },

  updateUnread: payload => {
    dispatch(unread(payload));
  },

  updateError: payload => {
    dispatch(error(payload));
  },

  hydrateTags: () => {
    dispatch(hydrateTags());
  },

  hydrateContacts: payload => {
    dispatch(hydrateContacts(payload));
  },

  hydrateGroups: payload => {
    dispatch(hydrateGroups(payload));
  },

  hydrateChannels: payload => {
    dispatch(hydrateChannels(payload));
  },

  hydrateEvents: payload => {
    dispatch(hydrateEvents(payload));
  },

  removeThread: payload => {
    dispatch(removeThread(payload));
  },

  addThread: payload => {
    dispatch(addThread(payload));
  },

  removeMessageReaction: payload => {
    dispatch(removeMessageReaction(payload));
  },

  addMessageReaction: payload => {
    dispatch(addMessageReaction(payload));
  },

  addMessage: payload => {
    dispatch(addMessage(payload));
  }
});

export const Router = connect(
  mapStateToProps,
  mapDispatchToProps
)(RouterRC);
