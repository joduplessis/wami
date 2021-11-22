import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  ActionSheetIOS,
  PushNotificationIOS
} from "react-native";
import { connect } from "react-redux";
import { connectActionSheet } from '@expo/react-native-action-sheet';
import {
  LabelComponent,
  AvatarComponent,
  MessageComponent,
  FilterComponent,
  SubheadingComponent,
  IconComponent,
  HeadingComponent
} from "../components";
import { UserModal, ChannelModal, ConfirmModal } from "../modals";
import NavigationService from "../helpers/NavigationService";
import {
  GQL,
  API_PATH,
  CONTACT,
  COLORS,
  USER,
  GROUP,
  CHANNEL,
  MQTT
} from "../helpers";
import { loading, error, hydrateThread, addChannel } from "../actions";
import { UnreadSchema } from "../schemas";
import Realm from "realm";

class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_modal: false,
      user: null,
      contacts_modal: false,
      channel_modal: false,
      channel: null,
      channel_owner_modal: false,
      channel_confirm_modal: false,
      channel_name: "",
      filter: "",
      threads: [],
      dataSource: null
    };

    this.fetchUser = this.fetchUser.bind(this);
    this.fetchChannel = this.fetchChannel.bind(this);
    this.fetchGroup = this.fetchGroup.bind(this);
    this.createChannel = this.createChannel.bind(this);
    this.navigateToMessaging = this.navigateToMessaging.bind(this);
    this.openAddActionMenu = this.openAddActionMenu.bind(this);
    this.startMessageThread = this.startMessageThread.bind(this);
    this.openChannelUserGroup = this.openChannelUserGroup.bind(this);
    this.createThreadFromChannelContactGroup = this.createThreadFromChannelContactGroup.bind(
      this
    );
    this.getChannelContactGroup = this.getChannelContactGroup.bind(this);
    this.getThreadCount = this.getThreadCount.bind(this);
    this.getThreadLast = this.getThreadLast.bind(this);
  }

  openAddActionMenu() {
    this.props.showActionSheetWithOptions(
      {
        options: ["Cancel", "Create new team", "Create new channel"],
        title: "Create",
        message: "Create a new team or channel",
        cancelButtonIndex: 0,
        destructiveButtonIndex: -1
      },
      index => {
        switch (index) {
          case 1:
            this.setState({ group_confirm_modal: true });
            break;
          case 2:
            this.setState({ channel_confirm_modal: true });
            break;
        }
      }
    );
  }

  addRealm(_id, kind, count) {
    Realm.open({
      schema: [UnreadSchema]
    })
      .then(realm => {
        const unreadThreads = realm
          .objects("Unread")
          .filtered(`kind == "${kind}" && _id == "${_id}"`);

        // Take only 1
        const unreadThread = unreadThreads[0];

        // If there is none, we add it
        if (!unreadThread) {
          realm.write(() => {
            realm.create("Unread", {
              _id,
              kind,
              last: "",
              count
            });
          });
        }
      })
      .catch(err => {
        this.props.updateError(err);
      });
  }

  componentDidMount() {
    // Debug
    // this.fetchUser("5c3c561542aa532c4e7adab3");

    // Get all threads locally on state
    Realm.open({
      schema: [UnreadSchema]
    })
      .then(realm => {
        // Get all threads
        let threads = realm.objects("Unread");
        const threadCount = parseInt(
          threads ? threads.filter(thread => thread.count != 0).length : 0
        );

        // Any time there is an update,
        realm.addListener("change", () => {
          // We update our state
          this.setState({
            threads
          });

          // Update the badge number of the app
          // Only use the number where count == 0
          // So no unreads
          // PushNotificationIOS.setApplicationIconBadgeNumber(threadCount);
        });

        // Also do this once on the get-go
        // PushNotificationIOS.setApplicationIconBadgeNumber(threadCount);

        // Set this 1 time initially
        this.setState({
          threads
        });
      })
      .catch(error => {
        this.props.updateError(error);
      });
  }

  startMessageThread(_id, kind) {
    const channelContactGroup = this.getChannelContactGroup(_id, kind);
    const thread = this.createThreadFromChannelContactGroup(
      channelContactGroup,
      kind
    );

    this.setState({ contacts_modal: false });
    this.addRealm(_id, kind, 0);
    this.navigateToMessaging(thread);
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

  createChannel() {
    const { _id } = this.props.account;
    const name = this.state.channel_name;
    const id = _id;
    const kind = USER;

    this.props.updateLoading(true);

    fetch(`${API_PATH}/channel`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      // user/group id
      // "user"/"group"
      // user id that gets added as the default member
      body: JSON.stringify({
        _id,
        name,
        id,
        kind
      })
    })
      .then(response => response.json())
      .then(channel => {
        // Create a blank entry so it's visible
        this.addRealm(channel._id, CHANNEL, 0);

        // Udpate MY state
        this.props.addChannel(channel);
        this.props.updateLoading(false);

        // Reset state
        this.setState({
          channel_name: "",
          channel_confirm_modal: false
        });
      })
      .catch(error => {
        this.props.updateLoading(false);
        this.props.updateError(error);
      });
  }

  navigateToMessaging(thread) {
    Realm.open({
      schema: [UnreadSchema]
    })
      .then(realm => {
        const threadParts = thread.topic.split("/");
        const kind = threadParts[0];
        const _id = threadParts[1];

        // Get all records that are this message kind/ message id
        const unreadThreads = realm
          .objects("Unread")
          .filtered(`kind == "${kind}" && _id == "${_id}"`);

        // Only take 1
        if (unreadThreads) {
          if (unreadThreads[0]) {
            realm.write(() => {
              unreadThreads[0].count = 0;
            });
          }
        }

        // Now fetch all messages
        this.props.hydrateThread(thread);

        // And go there
        NavigationService.navigate("Messaging");
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  openChannelUserGroup(thread) {
    switch (thread.kind) {
      case GROUP:
        this.fetchGroup(thread._id);
        break;

      case CHANNEL:
        this.fetchChannel(thread._id);
        break;

      case CONTACT:
        const contact = this.props.contacts
          .filter(contact => contact._id == thread._id)
          .flatten();
        const userId =
          contact.contact._id == this.props.account._id
            ? contact.user._id
            : contact.contact._id;
        this.fetchUser(userId);
        break;
    }
  }

  getChannelContactGroup(_id, kind) {
    let ccg;

    // Get the object this thread is referring to
    switch (kind) {
      case CONTACT:
        ccg = this.props.contacts
          .filter(contact => contact._id == _id)
          .flatten();
        break;
      case CHANNEL:
        ccg = this.props.channels
          .filter(channel => channel._id == _id)
          .flatten();
        break;
      case GROUP:
        ccg = this.props.groups.filter(group => group._id == _id).flatten();
        break;
    }

    return ccg;
  }

  createThreadFromChannelContactGroup(ccg, kind) {
    return {
      kind,
      _id: ccg._id,
      topic: MQTT.topic(kind, ccg._id),
      name:
        kind == CONTACT
          ? ccg.contact._id == this.props.account._id
            ? ccg.user.name
            : ccg.contact.name
          : ccg.name,
      title:
        kind == CONTACT
          ? ccg.contact._id == this.props.account._id
            ? ccg.user.title
            : ccg.contact.title
          : kind == CHANNEL
          ? ccg.user
            ? ccg.user.name
            : ccg.group.name
          : "TEAM",
      image:
        kind == CONTACT
          ? ccg.contact._id == this.props.account._id
            ? ccg.user.image
            : ccg.contact.image
          : ccg.image,
      color:
        kind == CHANNEL
          ? ccg.user
            ? ccg.user.color
            : ccg.group.color
          : kind == CONTACT
          ? ccg.contact._id == this.props.account._id
            ? ccg.user.color
            : ccg.contact.color
          : ccg.color
    };
  }

  getThreadLast(_id, kind) {
    const thread = this.state.threads
      .filter(thread => thread._id == _id && thread.kind == kind)
      .flatten();

    return thread ? thread.last : null;
  }

  getThreadCount(_id, kind) {
    const thread = this.state.threads
      .filter(thread => thread._id == _id && thread.kind == kind)
      .flatten();

    return thread ? thread.count : 0;
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ChannelModal
          channel={this.state.channel}
          visible={this.state.channel_modal}
          closeCallback={() =>
            this.setState({ channel_modal: false, channel: null })
          }
          locked={false}
        />

        <UserModal
          showActionSheetWithOptions={this.props.showActionSheetWithOptions}
          user={this.state.user}
          visible={this.state.user_modal}
          closeCallback={() =>
            this.setState({ userl: null, user_modal: false })
          }
        />

        <ConfirmModal
          visible={this.state.channel_confirm_modal}
          placeholder="New channel name"
          color={this.props.account.color}
          text={this.state.channel_name}
          updateCallback={text => this.setState({ channel_name: text })}
          confirmCallback={this.createChannel}
          closeCallback={() =>
            this.setState({ channel_name: "", channel_confirm_modal: false })
          }
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Image
            style={{
              zIndex: 0,
              width,
              height: 300,
              position: "relative",
              top: -100,
              right: 0,
              marginBottom: -150,
              marginTop: -120
            }}
            source={require("../../assets/images/headers/01.png")}
            resizeMode="contain"
          />

          <HeadingComponent
            text="Messages"
            color={COLORS.DARK.v6}
            style={{ paddingBottom: 10, paddingLeft: 20, paddingTop: 60 }}
          />

          <View
            style={{
              width,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              alignContent: "flex-start"
            }}
          >
            <FilterComponent
              action={filter => this.setState({ filter })}
              text={this.state.filter}
              placeholder="Filter Messages"
              style={{ flex: 1, padding: 0 }}
              color={COLORS.DARK.v4}
              placeholderColor={COLORS.LIGHT.v5}
            />
          </View>

          <SubheadingComponent
            title="People   "
            color={COLORS.DARK.v2}
            style={{ paddingBottom: 10, paddingLeft: 20, paddingTop: 10 }}
          />

          {this.props.contacts.map((contact, index) => {
            const re = new RegExp(this.state.filter + ".*");
            const userIsCoach = contact.contact._id == this.props.account._id;

            // Create our thread object
            const threadObject = this.createThreadFromChannelContactGroup(
              contact,
              CONTACT
            );

            // There must be a match
            if (!threadObject.name.match(re)) return;

            // Make sure the proper format is given from our thread object
            return (
              <MessageComponent
                key={index}
                unread={this.getThreadCount(contact._id, CONTACT)}
                last={this.getThreadLast(contact._id, CONTACT)}
                name={threadObject.name}
                color={threadObject.color}
                image={threadObject.image}
                title={userIsCoach ? "CLIENT" : "COACH"}
                avatarAction={() => this.openChannelUserGroup(threadObject)}
                action={() => this.navigateToMessaging(threadObject)}
              />
            );
          })}

          {this.props.contacts.length == 0 && (
            <SubheadingComponent
              title="You have no coaches yet"
              color={COLORS.DARK.v5}
              style={{ paddingBottom: 30, paddingLeft: 20, paddingTop: 10 }}
            />
          )}

          <View
            style={{
              paddingBottom: 10,
              paddingLeft: 20,
              paddingTop: 40,
              paddingRight: 20,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <SubheadingComponent title="Communities" color={COLORS.DARK.v2} />

            {this.props.account.plan != 0 && (
              <IconComponent
                name="plus"
                size={20}
                color={COLORS.DARK.v2}
                action={() => this.setState({ channel_confirm_modal: true })}
              />
            )}
          </View>

          {this.props.channels.map((channel, index) => {
            const re = new RegExp(this.state.filter + ".*");

            // Create our thread object
            const threadObject = this.createThreadFromChannelContactGroup(
              channel,
              CHANNEL
            );

            // There must be a match
            if (!threadObject.name.match(re)) return;

            // Make sure the proper format is given from our thread object
            return (
              <MessageComponent
                key={index}
                unread={this.getThreadCount(channel._id, CHANNEL)}
                last={this.getThreadLast(channel._id, CHANNEL)}
                name={threadObject.name}
                color={threadObject.color}
                image={threadObject.image}
                private={channel.private}
                title={threadObject.title}
                avatarAction={() => this.openChannelUserGroup(threadObject)}
                action={() => this.navigateToMessaging(threadObject)}
              />
            );
          })}

          {this.props.channels.length == 0 && (
            <SubheadingComponent
              title="You have joined no communities yet"
              color={COLORS.DARK.v5}
              style={{ paddingBottom: 30, paddingLeft: 20, paddingTop: 10 }}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  channels: state.channels,
  contacts: state.contacts,
  groups: state.groups,
  events: state.events,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  hydrateThread: payload => {
    dispatch(hydrateThread(payload));
  },

  updateError: payload => {
    dispatch(error(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  },

  addChannel: payload => {
    dispatch(addChannel(payload));
  }
});

export const MessagesScreen = connectActionSheet(connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages));
