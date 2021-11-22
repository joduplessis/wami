import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { UserComponent } from "../components";
import { UserModal } from "../modals";
import Icon from "react-native-vector-icons/Feather";
import { COLORS, GQL } from "../helpers";
import { loading, menu, error } from "../actions";
import MapView, { Marker, Callout } from "react-native-maps";

class MapScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      latitude: -29.7345608,
      longitude: 31.0297025,
      calendars: [],
      user: null,
      user_modal: false
    };

    this.navigateToMain = this.navigateToMain.bind(this);
    this.openSidebar = this.openSidebar.bind(this);
    this.search = this.search.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          //latitude: position.coords.latitude,
          //longitude: position.coords.longitude,
        });

        this.fetchCalendarsGeo();
      },
      error => {
        this.props.updateError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  }

  fetchCalendarsGeo() {
    this.props.updateLoading(true);

    GQL.fetchCalendarsForGeo(
      this.state.longitude,
      this.state.latitude,
      this.props.common.token
    )
      .then(result => result.json())
      .then(result => {
        const { calendarsGeo } = result.data;

        this.setState({
          calendars: calendarsGeo
        });

        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  fetchUser(id) {
    this.props.updateLoading(true);

    GQL.fetchUser(id, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { user, userAvailability, userRating } = result.data;

        this.setState({
          user_modal: true,
          user: {
            user,
            userAvailability,
            userRating
          }
        });

        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  startConversation(id, kind) {
    this.setState({
      user_modal: false
    });

    // TODO!
    console.log("Starting convo with ", id);
  }

  async search() {
    try {
      const { search } = this.state;

      // If they hit a blank
      if (search == "") {
        // Reload all calendars
        this.fetchCalendarsGeo();
      } else {
        // Check if ther are real cals
        if (!this.state.calendars) return;
        if (this.state.calendars.length == 0) return;

        // Santitize them
        const calendars = this.state.calendars.filter(calendar => {
          if (!calendar) return false;
          if (!calendar.user) return false;
          if (
            !calendar.user.name ||
            !calendar.user.color ||
            !calendar.user.description ||
            !calendar.user.image ||
            !calendar.user.title ||
            !calendar.user.tags
          )
            return false;
          if (calendar.user.tags.length == 0) return false;

          const tags = calendar.user.tags
            .map((tag, _) => tag.name)
            .join(",")
            .toLowerCase();

          return (
            calendar.user.name.toLowerCase().indexOf(search.toLowerCase()) !=
              -1 ||
            calendar.user.description
              .toLowerCase()
              .indexOf(search.toLowerCase()) != -1 ||
            calendar.user.title.toLowerCase().indexOf(search.toLowerCase()) !=
              -1 ||
            tags.indexOf(search.toLowerCase()) != -1
          );
        });

        // Update our state if it's valid
        if (calendars) this.setState({ calendars });
      }
    } catch (err) {
      console.log(err);
    }
  }

  navigateToMain() {
    this.props.navigation.navigate("Main");
  }

  openSidebar() {
    this.props.updateMenu(true);
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <UserModal
          user={this.state.user}
          visible={this.state.user_modal}
          closeCallback={() => this.setState({ user: null, user_modal: false })}
        />

        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1, height }}
            zoomControlEnabled={true}
            //onRegionChange={(region) => console.log(region)}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            {this.state.calendars.map((calendar, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    longitude: calendar.location.coordinates[0],
                    latitude: calendar.location.coordinates[1]
                  }}
                >
                  <Image
                    source={require("../../assets/images/location.png")}
                    style={{ width: 50, height: 50 }}
                  />

                  <Callout key={index}>
                    <UserComponent
                      key={index}
                      action={() => this.fetchUser(calendar.user._id)}
                      image={calendar.user.image}
                      color={calendar.user.color}
                      name={calendar.user.name}
                      title={calendar.user.title}
                    />
                  </Callout>
                </Marker>
              );
            })}
          </MapView>

          {/*

                    <View style={{ left: 0, width, position: 'absolute', top: 0, padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>

                        <View style={{ flex: 1, backgroundColor: 'white', padding: 20, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>

                            <TextInput
                                value={this.state.search}
                                onChangeText={(text) => this.setState({ search: text })}
                                placeholderTextColor="#C5C5D2"
                                placeholder="Eg. Nutritionist"
                                style={{ flex: 1, color: '#424E5E', fontSize: 20, fontWeight: '500' }}
                            />

                            <TouchableOpacity onPress={this.search}>
                                <Icon name="search" size={20} color="#C5C5D2" />
                            </TouchableOpacity>
                        </View>

                    </View>

                    */}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  threads: state.threads,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  updateError: payload => {
    dispatch(error(payload));
  },

  updateMenu: payload => {
    dispatch(menu(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  }
});

export const MapScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreenRC);
