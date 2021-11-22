import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { connect } from "react-redux";
import {
  SectionHeadingComponent,
  SliderComponent,
  ChannelComponent,
  UserComponent,
  LabelComponent,
  HeadingComponent,
  IconComponent,
  SubheadingComponent
} from "../components";
import { GroupModal, ChannelModal, UserModal } from "../modals";
import { loading, menu, error } from "../actions";
import { GQL, COLORS } from "../helpers";

class SearchScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_modal: false,
      user: null
    };

    this.fetchUser = this.fetchUser.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      // this.fetchUser("5c3c561542aa532c4e7adab3");
    }, 1000);
  }

  fetchUser(id) {
    this.props.updateLoading(true);

    GQL.fetchUser(id, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { user, userAvailability } = result.data;

        this.setState({
          user_modal: true,
          user: {
            user,
            userAvailability
          }
        });

        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  render() {
    const { height, width } = Dimensions.get("screen");
    const users = this.props.navigation.getParam("users", []);
    const tag = this.props.navigation.getParam("tag", "");

    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignContent: "flex-start"
        }}
      >
        <UserModal
          user={this.state.user}
          tag={tag}
          visible={this.state.user_modal}
          closeCallback={() =>
            this.setState({
              user: null,
              user_modal: false
            })
          }
        />

        <ScrollView
          style={{ backgroundColor: "white", zIndex: 4, width }}
          contentContainerStyle={{ width, paddingBottom: 20 }}
        >
          <Image
            style={{
              zIndex: 0,
              width,
              height: 300,
              position: "absolute",
              top: -90,
              left: 0
            }}
            source={require("../../assets/images/background-header.png")}
            resizeMode="cover"
          />

          <View
            style={{
              zIndex: 8,
              width,
              flexDirection: "row",
              alignItems: "flex-start",
              alignContent: "flex-start",
              justifyContent: "flex-start",
              padding: 20,
              paddingTop: 40,
              marginBottom: 40
            }}
          >
            <IconComponent
              size={26}
              name="arrow-left"
              color={COLORS.DARK.v3}
              action={() => this.props.navigation.goBack()}
            />
          </View>

          <View
            style={{
              zIndex: 8,
              width,
              flexDirection: "column",
              alignItems: "flex-start",
              alignContent: "flex-start",
              justifyContent: "flex-start"
            }}
          >
            <HeadingComponent
              text="Search Results"
              color={COLORS.DARK.v6}
              style={{ padding: 20, paddingBottom: 5 }}
            />

            <SubheadingComponent
              title="Partner up with someone who can help"
              color={COLORS.DARK.v6}
              style={{ padding: 20, paddingBottom: 5 }}
            />

            <View
              style={{
                padding: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignContent: "flex-start",
                flexWrap: "wrap"
              }}
            >
              {users.map((user, index) => {
                return (
                  <UserComponent
                    key={index}
                    action={() => this.fetchUser(user._id)}
                    image={user.image}
                    name={user.name}
                    color={user.color}
                    title={user.title}
                    style={{ marginRight: 15 }}
                  />
                );
              })}
            </View>

            {users.length == 0 && (
              <HeadingComponent
                text="We could not find anyone! Sorry."
                color={COLORS.DARK.v4}
                numberOfLines={5}
                size={16}
                style={{ textAlign: "center", padding: 20 }}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  updateError: payload => {
    dispatch(error(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  },

  updateMenu: payload => {
    dispatch(menu(payload));
  }
});

export const SearchScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchScreenRC);
