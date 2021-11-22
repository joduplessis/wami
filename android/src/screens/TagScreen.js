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
  SubheadingComponent,
  BlockComponent
} from "../components";
import { GroupModal, ChannelModal, UserModal } from "../modals";
import { loading, menu, error } from "../actions";
import { GQL, COLORS } from "../helpers";

class TagScreenRC extends React.Component {
  constructor(props) {
    super(props);

    // Our state (obviously)
    this.state = {
      user_modal: false,
      group_modal: false,
      channel_modal: false,
      channels: [],
      channel: null,
      users: [],
      user: null,
      group: null,
      tag: null
    };

    this.navigateToChannels = this.navigateToChannels.bind(this);
    this.navigateToExperts = this.navigateToExperts.bind(this);
    this.openSidebar = this.openSidebar.bind(this);
    this.updateTag = this.updateTag.bind(this);
    this.fetchChannel = this.fetchChannel.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
    this.fetchGroup = this.fetchGroup.bind(this);
    this.fetchScreenData = this.fetchScreenData.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.fetchScreenData();

    setTimeout(() => {
      //this.fetchChannel("5c3c5a1042aa532c4e7adab6");
    }, 1000);
  }

  fetchScreenData() {
    const tag = this.props.navigation.getParam("tag", null);

    if (!tag) return;

    this.props.updateLoading(true);

    GQL.fetchTag(tag, 10, this.props.common.token)
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

  fetchChannel(id) {
    this.props.updateLoading(true);

    GQL.fetchChannel(id, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { channel } = result.data;

        this.setState({
          channel,
          channel_modal: true
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

  fetchGroup(id) {
    this.props.updateLoading(true);

    GQL.fetchGroup(id, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { group } = result.data;

        this.setState({
          group_modal: true,
          group
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
      user_modal: false,
      channel_modal: false
    });

    // TODO!
    console.log("Starting convo with ", id);
  }

  navigateToChannels() {
    this.props.navigation.navigate("Channels", {
      tag: this.state.tag._id
    });
  }

  navigateToExperts() {
    this.props.navigation.navigate("Experts", {
      tag: this.state.tag._id
    });
  }

  openSidebar() {
    this.props.updateMenu(true);
  }

  updateTag(tag) {
    this.setState({
      tag
    });

    this.fetchChannelsAndUsers(tag);
  }

  goBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { height, width } = Dimensions.get("screen");

    if (!this.state.tag) return null;

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
        <ChannelModal
          channel={this.state.channel}
          visible={this.state.channel_modal}
          closeCallback={() =>
            this.setState({ channel: null, channel_modal: false })
          }
        />

        <UserModal
          user={this.state.user}
          visible={this.state.user_modal}
          closeCallback={() =>
            this.setState({ userl: null, user_modal: false })
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
              paddingTop: 40,
              paddingBottom: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <IconComponent
              name="arrow-left"
              color={COLORS.DARK.v3}
              action={this.goBack}
              size={26}
              style={{ marginLeft: 20 }}
            />

            <HeadingComponent
              text={this.state.tag.name}
              color={COLORS.DARK.v3}
              style={{ paddingLeft: 10, flex: 1 }}
            />
          </View>

          <SubheadingComponent
            title={`${this.state.channels.length} communities`}
            color={COLORS.DARK.v1}
            style={{ paddingBottom: 20, paddingLeft: 20 }}
          />

          {this.state.channels && (
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignContent: "flex-start"
              }}
            >
              {this.state.channels.map((channel, index) => {
                return (
                  <BlockComponent
                    key={index}
                    color={channel.user.color}
                    action={() => this.fetchChannel(channel._id)}
                    image={channel.image}
                    icon={channel.image ? null : "shield"}
                    title={channel.name}
                    subtitle={channel.description}
                    style={{ marginBottom: 20 }}
                  />
                );
              })}
            </View>
          )}
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

export const TagScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagScreenRC);
