import React from "react";
import {
  Modal,
  Button,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  ActionSheetIOS,
  Platform
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
import { connectActionSheet } from '@expo/react-native-action-sheet';
import {
  ButtonComponent,
  AvatarComponent,
  ThreadMessageComponent,
  IconComponent,
  HeadingComponent,
  SubheadingComponent,
  LabelComponent
} from "../components";
import { EventModal, ChannelModal, UserModal, GroupModal } from "../modals";
import {
  COLORS,
  FONT,
  API_PATH,
  CONTACT,
  MQTT,
  GQL,
  uploadFile,
  EventFactory
} from "../helpers";
import {
  loading,
  menu,
  error,
  eventIncoming,
  addMessage,
  updateMessage,
  updateMessageRemoveReaction,
  updateMessageAddReaction,
  hydrateThread,
  addMessageBase
} from "../actions";
import ImagePicker from "react-native-image-crop-picker";
import { UnreadSchema } from "../schemas";
import Realm from "realm";
import NavigationService from "../helpers/NavigationService";

const moment = require("moment-timezone");

class MessagingScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      event_modal: false,
      event: null,
      user_modal: false,
      user: null,
      channel_modal: false,
      channel: null,
      group_modal: false,
      group: null
    };

    this.startVideoCall = this.startVideoCall.bind(this);
    this.moreMenu = this.moreMenu.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.pickCamera = this.pickCamera.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
    this.fetchGroup = this.fetchGroup.bind(this);
    this.fetchChannel = this.fetchChannel.bind(this);
    this.openUserDetails = this.openUserDetails.bind(this);
    this.removeMessageReaction = this.removeMessageReaction.bind(this);
    this.addMessageReaction = this.addMessageReaction.bind(this);
    this.goBack = this.goBack.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
  }

  clearHistory() {
    Alert.alert(
      "Clear message history?",
      "Are you sure you want to clear this message history?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            Realm.open({
              schema: [UnreadSchema]
            })
              .then(realm => {
                // Get this message thread
                const thread = realm
                  .objects("Unread")
                  .filtered(`_id == "${this.props.thread._id}"`);

                // If there is none, we add it
                realm.write(() => {
                  realm.delete(thread);

                  // Navigate back
                  this.goBack();
                });
              })
              .catch(err => {
                this.props.updateError(err);
              });
          }
        }
      ],
      { cancelable: true }
    );
  }

  getContact() {
    return this.props.contacts
      .filter(contact => {
        return (
          (contact.contact._id == this.state._id &&
            contact.user._id == this.props.account._id) ||
          (contact.contact._id == this.props.account._id &&
            contact.user._id == this.state._id)
        );
      })
      .flatten();
  }

  openUserDetails() {
    const contact = this.props.contacts
      .filter(contact => contact._id == this.props.thread._id)
      .flatten();

    // Has to be a vlid
    if (!contact) return;

    const userId = contact
      ? contact.contact._id == this.props.account._id
        ? contact.user._id
        : contact.contact._id
      : null;
    const isExpert = contact.contact._id == this.props.account._id;

    NavigationService.navigate("UserDetails", {
      userId,
      isExpert,
      goals: contact.goals,
      conditions: contact.conditions,
      consultations: contact.consultations
    });
  }

  pickCamera() {
    ImagePicker.openCamera({
      width: 500,
      height: 800,
      cropping: true
    })
      .then(response => {
        const { filename, sourceURL, path } = response;
        const filenameForIosAndAndroid = Platform.OS == "ios" ? filename : path.split('/')[path.split('/').length - 1];
        const key = `${this.props.thread.topic}/${filenameForIosAndAndroid}`;
        const ext = filenameForIosAndAndroid.split(".")[filenameForIosAndAndroid.split(".").length - 1];
        const mime = ext.toLowerCase() == "jpg" ? "jpeg" : ext.toLowerCase();
        const mimeString = `image/${mime}`;

        this.props.updateLoading(true);

        uploadFile(filenameForIosAndAndroid, path, key)
          .then(result => {
            this.props.updateLoading(false);
            this.sendMessage(filenameForIosAndAndroid, mimeString, key);
          })
          .catch(error => {
            this.props.updateLoading(false);
            this.props.updateError(error);
          });
      })
      .catch(error => {
        // This is due to the cancel
        this.props.updateLoading(false);
        this.props.updateError(null);
      });
  }

  pickImage() {
    ImagePicker.openPicker({
      width: 500,
      height: 800,
      cropping: true
    })
      .then(response => {
        const { filename, sourceURL, path } = response;
        const filenameForIosAndAndroid = Platform.OS == "ios" ? filename : path.split('/')[path.split('/').length - 1];
        const key = `${this.props.thread.topic}/${filenameForIosAndAndroid}`;
        const ext = filenameForIosAndAndroid.split(".")[filenameForIosAndAndroid.split(".").length - 1];
        const mime = ext.toLowerCase() == "jpg" ? "jpeg" : ext.toLowerCase();
        const mimeString = `image/${mime}`;

        this.props.updateLoading(true);

        uploadFile(filenameForIosAndAndroid, path, key)
          .then(result => {
            this.props.updateLoading(false);
            this.sendMessage(filenameForIosAndAndroid, mimeString, key);
          })
          .catch(error => {
            this.props.updateLoading(false);
            this.props.updateError(error);
          });
      })
      .catch(error => {
        this.props.updateLoading(false);
        this.props.updateError(null);
      });
  }

  startVideoCall() {
    const contact = this.props.contacts
      .filter(contact => contact._id == this.props.thread._id)
      .flatten();

    // Send them a push message
    fetch(`${API_PATH}/contact/${contact._id}/call`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        sender: contact.contact._id
      })
    })
      .then(response => response.json())
      .then(response => {
        EventFactory.get().emit("start", {
          receiver: contact.user,
          sender: contact.contact
        });
      })
      .catch(error => {
        this.props.updateError(error);
      });
  }

  moreMenu() {
    let options;

    if (this.props.thread.kind == CONTACT) {
      options = ["Cancel", "View all images"];
    } else {
      options = ["Cancel", "View all members", "View all images"];
    }

    this.props.showActionSheetWithOptions(
      {
        options,
        title: this.props.thread.name,
        message: "Message Thread Options",
        cancelButtonIndex: 0,
        destructiveButtonIndex: -1
      },
      index => {
        switch (index) {
          case 1:
            this.navigateToMembers();
            break;
          case 2:
            this.navigateToAttachments();
            break;
          case 3:
            this.deleteThread();
            break;
        }
      }
    );
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

  fetchEvent(id) {
    this.props.updateLoading(true);

    GQL.fetchEvent(id, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { event } = result.data;

        this.setState({
          event,
          event_modal: true
        });

        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  addMessageReaction(id, reaction) {
    fetch(`${API_PATH}/message/${id}/reactions/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        reaction
      })
    })
      .then(response => response.json())
      .then(message => {
        // Add it to our store & broadcast
        this.props.updateMessageAddReaction(
          {
            message: id,
            reaction: reaction
          },
          this.props.thread.topic
        );
      })
      .catch(error => {
        this.props.updateError(error);
      });
  }

  removeMessageReaction(id, reaction) {
    fetch(`${API_PATH}/message/${id}/reactions/remove`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        reaction
      })
    })
      .then(response => response.json())
      .then(message => {
        // Add it to our store & broadcast
        this.props.updateMessageRemoveReaction(
          {
            message: id,
            reaction: reaction
          },
          this.props.thread.topic
        );
      })
      .catch(error => {
        this.props.updateError(error);
      });
  }

  sendMessage(text, mime, url) {
    fetch(`${API_PATH}/message`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        text,
        mime,
        url,
        sender: this.props.account._id,
        reactions: [],
        topic: this.props.thread.topic
      })
    })
      .then(response => response.json())
      .then(message => {
        this.props.addMessage(
          {
            _id: message._id,
            text,
            mime,
            url,
            sender: {
              _id: this.props.account._id,
              color: this.props.account.color,
              name: this.props.account.name,
              title: this.props.account.title,
              image: this.props.account.image,
              plan: this.props.account.plan
            },
            reactions: [],
            topic: this.props.thread.topic
          },
          this.props.thread.topic
        );

        // reset our text field
        this.setState({ message: "" });
      })
      .catch(error => {
        this.props.updateError(error);
      });
  }

  componentDidMount() {
    setTimeout(() => {
      // this.openUserDetails()
    }, 1000);
  }

  goBack() {
    this.props.hydrateThread({
      kind: "",
      _id: "",
      topic: "",
      name: this.props.thread.name,
      title: this.props.thread.title,
      image: this.props.thread.image,
      color: this.props.thread.color
    });
    this.props.navigation.goBack();
  }

  render() {
    if (!this.props.thread) return null;

    const clearable = false; // WILL ALWAYS BE FALSE WITH COACHES this.props.thread.kind == GROUP || this.props.thread.kind == CONTACT;
    const today = moment(new Date());
    const { height, width } = Dimensions.get("screen");
    const contact = this.props.contacts
      .filter(contact => contact._id == this.props.thread._id)
      .flatten();
    const otherUserId = contact
      ? contact.contact._id == this.props.account._id
        ? contact.user._id
        : contact.contact._id
      : null;
    const userIsCoach = contact
      ? contact.contact._id == this.props.account._id
      : false;
    const events = contact
      ? this.props.events.filter(event => {
          return (
            (otherUserId == event.expert._id &&
              this.props.account._id == event.owner._id) ||
            (this.props.account._id == event.expert._id &&
              otherUserId == event.owner._id)
          );
        })
      : null;

    return (
      <View style={{ flex: 1, backgroundColor: this.props.thread.color }}>
        <ChannelModal
          channel={this.state.channel}
          visible={this.state.channel_modal}
          closeCallback={() =>
            this.setState({ channel: null, channel_modal: false })
          }
          locked={false}
          navigateToMyChannels={() => null}
        />

        <EventModal
          visible={this.state.event_modal}
          event={this.state.event}
          closeCallback={() =>
            this.setState({ event_modal: false, event: null })
          }
        />

        <UserModal
          user={this.state.user}
          visible={this.state.user_modal}
          closeCallback={() =>
            this.setState({ userl: null, user_modal: false })
          }
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
          <View
            style={{
              zIndex: 3,
              paddingBottom: 20,
              paddingTop: 40,
              width,
              paddingLeft: 20,
              paddingRight: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <IconComponent
              name="arrow-left"
              color="white"
              size={26}
              action={this.goBack}
            />

            <View
              style={{
                flex: 1,
                paddingLeft: 10,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                alignContent: "center"
              }}
            >
              <SubheadingComponent
                title={this.props.thread.name}
                color="white"
              />

              {this.props.thread.kind == CONTACT && !userIsCoach && (
                <LabelComponent text="Coach" color="white" />
              )}
            </View>

            {this.props.thread.kind == CONTACT && (
              <IconComponent
                name="activity"
                size={24}
                color="white"
                action={this.openUserDetails}
              />
            )}
          </View>
        </View>

        {events && events.length != 0 && (
          <View
            style={{
              width,
              padding: 20,
              paddingTop: 0,
              backgroundColor: this.props.thread.color
            }}
          >
            {events.map((event, index) => {
              const date = moment(event.start).tz(this.props.account.timezone);
              const isEventToday = date.isSame(today, "d");
              const time = isEventToday
                ? date.format("h:mm a")
                : date.format("MMM Do");

              return (
                <TouchableOpacity
                  onPress={() => this.fetchEvent(event._id)}
                  key={index}
                  style={{
                    marginBottom: 3,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <View style={{ marginRight: 10 }}>
                    <Icon name="calendar" size={20} color="white" />
                  </View>

                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      fontFamily: FONT,
                      flex: 1,
                      color: "white",
                      fontSize: 18,
                      fontWeight: "600"
                    }}
                  >
                    {event.notes}
                  </Text>

                  <View
                    style={{
                      marginLeft: 10,
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      alignContent: "flex-start",
                      borderRadius: 20,
                      zIndex: 6,
                      padding: 10,
                      paddingRight: 10,
                      marginRight: 3
                    }}
                  >
                    <Icon
                      name="clock"
                      size={15}
                      color="rgba(255, 255, 255, 0.5)"
                    />

                    <Text
                      style={{
                        paddingLeft: 5,
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: 12,
                        fontFamily: FONT,
                        fontWeight: "800"
                      }}
                    >
                      {time}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={{ flex: 1 }}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.scrollView.scrollToEnd({ animated: true });
          }}
        >
          <ScrollView
            style={{ flex: 1, backgroundColor: "white", zIndex: 4 }}
            contentContainerStyle={{
              backgroundColor: "white",
              paddingTop: 500
            }}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            <View>
              {this.props.messages.map((message, index) => {
                const threadMessageObject = {
                  id: message._id ? message._id : "",
                  text: message.text ? message.text : "Error",
                  mime: message.mime ? message.mime : "text/plain",
                  url: message.url ? message.url : null,
                  createdAt: message.createdAt
                    ? moment(message.createdAt)
                        .tz(this.props.account.timezone)
                        .fromNow()
                    : "Now",
                  reactions: message.reactions ? message.reactions : [],
                  name: message.sender ? message.sender.name : "Wamier",
                  color: message.sender ? message.sender.color : COLORS.DARK.v5,
                  image: message.sender ? message.sender.image : "",
                  plan: message.sender ? message.sender.plan : 0
                };

                return (
                  <ThreadMessageComponent
                    key={index}
                    owner={message.sender._id == this.props.account._id}
                    id={threadMessageObject.id}
                    uname={this.props.account.name}
                    uid={this.props.account._id}
                    plan={threadMessageObject.plan}
                    text={threadMessageObject.text}
                    mime={threadMessageObject.mime}
                    url={threadMessageObject.url}
                    createdAt={threadMessageObject.createdAt}
                    reactions={threadMessageObject.reactions}
                    name={threadMessageObject.name}
                    image={threadMessageObject.image}
                    color={threadMessageObject.color}
                    topic={this.props.thread.topic}
                    updateMessage={this.updateMessage}
                    addMessageReaction={this.addMessageReaction}
                    removeMessageReaction={this.removeMessageReaction}
                  />
                );
              })}
            </View>
          </ScrollView>

          <View
            style={{
              borderTopWidth: 2,
              borderTopColor: "#eef2f5",
              width: "100%",
              height: 110,
              backgroundColor: "white",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                flex: 1,
                padding: 10,
                paddingBottom: 0,
                paddingTop: 0,
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <TextInput
                multiline={true}
                placeholder="Say something"
                placeholderTextColor="#C5C5D2"
                ref={input => {
                  this.textInput = input;
                }}
                value={this.state.message}
                style={{
                  flex: 1,
                  color: "#424E5E",
                  fontSize: 18,
                  fontFamily: FONT,
                  fontWeight: "600"
                }}
                onChangeText={message => {
                  this.setState({ message });
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                padding: 10,
                paddingBottom: 10,
                paddingTop: 0,
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              {this.props.thread.kind == CONTACT && userIsCoach && (
                <IconComponent
                  name="video"
                  size={22}
                  color={this.props.thread.color}
                  action={this.startVideoCall}
                  style={{ marginRight: 20 }}
                />
              )}

              <IconComponent
                name="image"
                size={22}
                color={this.props.thread.color}
                action={this.pickImage}
                style={{ marginRight: 20 }}
              />

              <IconComponent
                name="camera"
                size={22}
                color={this.props.thread.color}
                action={this.pickCamera}
                style={{ marginRight: 20 }}
              />

              <View style={{ flex: 1 }} />

              <ButtonComponent
                title="Send"
                color={this.props.thread.color}
                action={() =>
                  this.state.message != ""
                    ? this.sendMessage(this.state.message, "text/plain", null)
                    : null
                }
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  thread: state.thread,
  messages: state.messages,
  common: state.common,
  contacts: state.contacts,
  events: state.events,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  updateMessage: (payload, topic) => {
    MQTT.dispatch(topic, updateMessage(payload));
    dispatch(updateMessage(payload));
  },

  updateMessageRemoveReaction: (payload, topic) => {
    MQTT.dispatch(topic, updateMessageRemoveReaction(payload));
    dispatch(updateMessageRemoveReaction(payload));
  },

  updateMessageAddReaction: (payload, topic) => {
    MQTT.dispatch(topic, updateMessageAddReaction(payload));
    dispatch(updateMessageAddReaction(payload));
  },

  addMessage: (payload, topic) => {
    MQTT.dispatch(topic, addMessageBase(payload));
    dispatch(addMessage(payload));
  },

  updateError: payload => {
    dispatch(error(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  },

  updateMenu: payload => {
    dispatch(menu(payload));
  },

  eventOpen: () => {
    dispatch(eventIncoming(true));
  },

  hydrateThread: payload => {
    dispatch(hydrateThread(payload));
  }
});

export const MessagingScreen = connectActionSheet(connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreenRC));
