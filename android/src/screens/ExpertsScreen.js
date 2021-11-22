import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
import { loading, error, menu } from "../actions";
import {
  LabelComponent,
  SectionHeadingComponent,
  HeadingComponent,
  UserComponent
} from "../components";
import { UserModal } from "../modals";
import { COLORS, GQL } from "../helpers";

class ExpertsScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      users: [],
      user_modal: false,
      tag: null
    };

    this.fetchUser = this.fetchUser.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    this.fetchScreenData();
  }

  fetchScreenData() {
    const tag = this.props.navigation.getParam("tag", null);

    if (!tag) return;

    this.props.updateLoading(true);

    GQL.fetchTag(tag, 100, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { tag, usersForTag, channelsForTag } = result.data;

        this.setState({
          channels: channelsForTag,
          users: usersForTag,
          tag: tag
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

  render() {
    const { height, width } = Dimensions.get("screen");

    if (!this.state.tag) return null;

    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
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
            paddingTop: 40,
            paddingBottom: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <TouchableOpacity onPress={this.goBack} style={{ marginLeft: 20 }}>
            <Icon name="arrow-left" size={26} color={this.state.tag.color} />
          </TouchableOpacity>

          <HeadingComponent
            title={`All ${this.state.tag.name.toTitleCase()}`}
            color={this.state.tag.color}
            style={{ paddingLeft: 10, flex: 1 }}
          />
        </View>

        <UserModal
          user={this.state.user}
          visible={this.state.user_modal}
          closeCallback={() => this.setState({ user: null, user_modal: false })}
        />

        <ScrollView
          style={{ backgroundColor: "white", zIndex: 4, width }}
          contentContainerStyle={{ width }}
        >
          <SectionHeadingComponent
            title={
              this.state.users.length == 1
                ? `${this.state.users.length} Expert`
                : `${this.state.users.length} Experts`
            }
            style={{
              borderTopWidth: 0,
              borderColor: "#eef2f5",
              paddingTop: 25,
              paddingBottom: 0,
              marginBottom: 0,
              marginTop: 0
            }}
            backgroundColor={this.state.color}
          />

          {this.state.users && (
            <View
              style={{
                padding: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignContent: "flex-start",
                alignItems: "flex-start",
                flexWrap: "wrap"
              }}
            >
              {this.state.users.map((user, index) => {
                return (
                  <UserComponent
                    key={index}
                    action={() => this.fetchUser(user._id)}
                    image={user.image}
                    name={user.name}
                    color={user.color}
                    title={user.title}
                    style={{ marginRight: 10 }}
                  />
                );
              })}
            </View>
          )}

          {this.state.users.length == 0 && (
            <LabelComponent text="NO EXPERTS AVAILABLE" />
          )}
        </ScrollView>
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

  updateLoading: payload => {
    dispatch(loading(payload));
  },

  updateMenu: payload => {
    dispatch(menu(payload));
  }
});

export const ExpertsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpertsScreenRC);
