import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {
  LoadingComponent,
  ErrorComponent,
  ButtonComponent,
  AvatarComponent
} from "../components";
import { GroupMembersModal } from "./";
import { TagsModal } from "./TagsModal";
import {
  COLORS,
  API_PATH,
  CHANNEL,
  S3_PATH,
  MQTT,
  uploadFile,
  FONT
} from "../helpers";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import {
  removeChannel,
  addChannel,
  updateChannel,
  updateChannelAddMember,
  updateChannelRemoveMember
} from "../actions";

class ChannelModalRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      loading: false,
      loaded: false,
      error: false,
      contacts_modal: false,
      channel_owner_modal: false,
      channel_members_modal: false,
      tags_modal: false,
      admin: false,
      member: false,

      // Channel properties
      _id: "",
      name: "",
      description: "",
      image: "https://joduplessis.com/hoola/category1.jpg",
      tags: [],
      user: null,
      group: null,
      members: [],
      private: false
    };

    this.toggleError = this.toggleError.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.deleteChannel = this.deleteChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
    this.leaveChannel = this.leaveChannel.bind(this);
    this.saveChannel = this.saveChannel.bind(this);
    this.closeCallback = this.closeCallback.bind(this);
    this.addMember = this.addMember.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
  }

  closeCallback() {
    this.props.closeCallback();
    this.setState({ _id: null });
  }

  deleteChannel() {
    Alert.alert(
      "Hold on!",
      "Are you sure you want to delete this channel (can not be undone)?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => this.deleteChannelAction() }
      ],
      { cancelable: true }
    );
  }

  deleteChannelAction() {
    fetch(`${API_PATH}/channel/${this.state._id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      }
    })
      .then(response => response.json())
      .then(json => {
        // Delete it for ourselves
        // Will be sent to all members by API too
        // This will also unsub me & delete Realm
        this.props.removeChannel(this.state._id);

        // Close the window
        this.closeCallback();
      })
      .catch(error => {
        context.setState({
          error
        });
      });
  }

  leaveChannel() {
    fetch(`${API_PATH}/channel/${this.state._id}/member/remove`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        _id: this.props.account._id
      })
    })
      .then(response => response.json())
      .then(channel => {
        // 1) First, update our current state
        this.setState({
          member: false,
          members: this.state.members.filter(member => {
            return member._id != this.props.account._id;
          })
        });

        // 2) Tell everyone else I'm gone
        this.props.updateChannelRemoveMember(
          {
            channel: this.state._id,
            member: this.props.account._id
          },
          MQTT.topic(CHANNEL, this.state._id)
        );

        // 3) This will be sent out from the API too
        // But remove this channel from my store. this will also
        // Clear Realm & Unsubscribe me from MQTT
        this.props.removeChannel(this.state._id);
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  joinChannel() {
    fetch(`${API_PATH}/channel/${this.state._id}/member/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        _id: this.props.account._id
      })
    })
      .then(response => response.json())
      .then(user => {
        // 1) Add the new channel to our store
        // This does not include the new member (us)
        // This will also subscribe us to this channel with MQTT
        // And then add a blank Realm entry for it
        this.props.addChannel({
          _id: this.state._id,
          name: this.state.name,
          description: this.state.description,
          image: this.state.image,
          tags: this.state.tags,
          user: this.state.user,
          private: this.state.private,
          group: this.state.group,
          members: this.state.members
        });

        // 2) Update our STATE with ourselves
        this.setState(
          {
            member: true,
            members: [...this.state.members, ...[user]]
          },
          () => {
            // 3) Tell ourselves & everyone else to add the new person
            // The new person will be notified by the API,
            // It's going to be us...
            this.props.updateChannelAddMember(
              {
                channel: this.state._id,
                member: { _id }
              },
              MQTT.topic(CHANNEL, this.state._id)
            );
          }
        );
      })
      .catch(error => {
        Alert.alert(error.toString());
        this.setState({
          error
        });
      });
  }

  deleteMember(_id) {
    fetch(`${API_PATH}/channel/${this.state._id}/member/remove`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({ _id })
    })
      .then(response => response.json())
      .then(channel => {
        // First, update our current state
        this.setState({
          members: this.state.members.filter(member => {
            return member._id != _id;
          })
        });

        // Tell everyone
        // The user being remove will be removed from the API side
        this.props.updateChannelRemoveMember(
          {
            channel: this.state._id,
            member: _id
          },
          MQTT.topic(CHANNEL, this.state._id)
        );
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  addMember(_id) {
    fetch(`${API_PATH}/channel/${this.state._id}/member/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({ _id })
    })
      .then(response => response.json())
      .then(user => {
        // First: add the user to out current state
        // The user is returned nicely from our API
        this.setState({
          channel_members_modal: false,
          members: [...this.state.members, ...[user]]
        });

        // Update out state & broadcast to everyone else
        this.props.updateChannelAddMember(
          {
            channel: this.state._id,
            member: { _id }
          },
          MQTT.topic(CHANNEL, this.state._id)
        );
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  saveChannel() {
    fetch(`${API_PATH}/channel/${this.state._id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        _id: this.state._id,
        name: this.state.name,
        description: this.state.description,
        image: this.state.image,
        tags: this.state.tags,
        private: this.state.private
      })
    })
      .then(response => response.json())
      .then(json => {
        // Update our own state
        this.props.updateChannel(
          {
            _id: this.state._id,
            name: this.state.name,
            description: this.state.description,
            image: this.state.image,
            private: this.state.private
          },
          MQTT.topic(CHANNEL, this.state._id)
        );

        // Saved!
        this.setState({
          edit: false
        });
      })
      .catch(error => {
        this.setState({
          error,
          edit: false
        });
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
        const key = `${CHANNEL}/${this.state._id}/${filenameForIosAndAndroid}`;

        this.setState({
          loading: true
        });

        uploadFile(filenameForIosAndAndroid, path, key)
          .then(result => {
            this.setState({
              loading: null,
              image: key,
              edit: true
            });
          })
          .catch(error => {
            this.setState({
              error: "Error uploading file",
              loading: null
            });
          });
      })
      .catch(error => {
        this.setState({
          error,
          loading: null
        });
      });
  }

  toggleError() {
    this.setState({
      error: false
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel) {
      if (nextProps.channel._id != this.state._id) {
        // Get our user object
        const {
          _id,
          name,
          description,
          image,
          tags,
          user,
          group,
          members
        } = nextProps.channel;

        // Is this user an admin?
        const admin = user
          ? user._id == this.props.account._id
          : group
          ? group.members.filter(member => {
              return member._id == this.props.account._id;
            }).length != 0
          : false;

        // Is this user a member of this channel?
        const member =
          members.filter(member => {
            return member._id == this.props.account._id;
          }).length != 0;

        // Update our state
        this.setState({
          _id,
          name,
          description,
          image,
          tags,
          user,
          group,
          members,
          member,
          admin,
          private: nextProps.channel.private, // Reserved word
          loaded: true
        });
      }
    }
  }

  render() {
    if (!this.state.loaded) return null;

    const { width, height } = Dimensions.get("screen");
    const color = this.state.user
      ? this.state.user.color
      : this.state.group
      ? this.state.group.color
      : "blue";

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.closeCallback}
      >
        <GroupMembersModal
          visible={this.state.channel_members_modal}
          closeCallback={() => this.setState({ channel_members_modal: false })}
          selectCallback={this.addMember}
          exclude={this.state.members}
        />

        <TagsModal
          visible={this.state.tags_modal}
          closeCallback={() => this.setState({ tags_modal: false })}
          selectCallback={tags => this.setState({ edit: true, tags: [tags] })}
          current={this.state.tags.flatten()}
          title="Category"
        />

        <ErrorComponent visible={this.state.error} action={this.toggleError} />

        <LoadingComponent visible={this.state.loading} />

        <View
          style={{
            flex: 1,
            backgroundColor: color,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <View
            style={{
              position: "relative",
              margin: 20,
              width,
              height,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                width,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <View
                style={{
                  zIndex: 6,
                  width,
                  padding: 0,
                  paddingBottom: 50,
                  paddingTop: 10,
                  height,
                  marginBottom: 10,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignContent: "flex-start"
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width,
                    height,
                    overflow: "hidden"
                  }}
                >
                  {!this.state.image && (
                    <Image
                      source={require("../../assets/images/background-white-transparent.png")}
                      style={{
                        zIndex: 3,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width,
                        height,
                        tintColor: "white",
                        opacity: 0.2
                      }}
                      resizeMode="cover"
                    />
                  )}

                  {this.state.image && (
                    <Image
                      style={{
                        zIndex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width,
                        height
                      }}
                      source={{ uri: `${S3_PATH}${this.state.image}` }}
                      resizeMode="cover"
                    />
                  )}

                  {this.state.image && (
                    <Image
                      source={require("../../assets/images/background-gradient-shadow.png")}
                      style={{
                        zIndex: 2,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width,
                        height
                      }}
                      resizeMode="cover"
                    />
                  )}
                </View>

                <KeyboardAvoidingView
                  behavior="padding"
                  enabled
                  style={{ flex: 1 }}
                >
                  <View
                    style={{
                      zIndex: 8,
                      width,
                      flexDirection: "row",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                      padding: 20,
                      paddingTop: 40
                    }}
                  >
                    <TouchableOpacity onPress={this.closeCallback}>
                      <Icon name="x" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    {this.state.edit && (
                      <TouchableOpacity
                        style={{
                          marginRight: 10,
                          padding: 5,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center"
                        }}
                        onPress={this.saveChannel}
                      >
                        <Icon name="save" size={22} color="white" />
                      </TouchableOpacity>
                    )}

                    {this.state.admin && (
                      <TouchableOpacity
                        onPress={this.pickImage}
                        style={{
                          marginRight: 10,
                          padding: 5,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center"
                        }}
                      >
                        <Icon name="image" size={22} color="white" />
                      </TouchableOpacity>
                    )}

                    {this.state.admin && (
                      <TouchableOpacity
                        onPress={() => this.setState({ tags_modal: true })}
                        style={{
                          marginRight: 10,
                          padding: 5,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center"
                        }}
                      >
                        <Icon name="hash" size={20} color="white" />
                      </TouchableOpacity>
                    )}

                    {this.state.admin && (
                      <TouchableOpacity
                        style={{
                          marginRight: 10,
                          padding: 5,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center"
                        }}
                        onPress={() =>
                          this.setState({ channel_members_modal: true })
                        }
                      >
                        <Icon name="user-plus" size={22} color="white" />
                      </TouchableOpacity>
                    )}

                    {this.state.admin && (
                      <TouchableOpacity
                        onPress={this.deleteChannel}
                        style={{
                          marginRight: 10,
                          padding: 5,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center"
                        }}
                      >
                        <Icon name="trash" size={20} color="white" />
                      </TouchableOpacity>
                    )}

                    {this.state.admin && (
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            private: !this.state.private,
                            edit: true
                          })
                        }
                        style={{
                          marginRight: 10,
                          padding: 5,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center"
                        }}
                      >
                        <Icon
                          name={this.state.private ? "eye-off" : "eye"}
                          size={20}
                          color="white"
                        />
                      </TouchableOpacity>
                    )}

                    {!this.state.admin && !this.state.member && (
                      <ButtonComponent
                        color={color}
                        action={this.joinChannel}
                        title="Join"
                        solid={true}
                      />
                    )}

                    {!this.state.admin && this.state.member && (
                      <ButtonComponent
                        color={color}
                        solid={true}
                        action={this.leaveChannel}
                        title="Leave"
                      />
                    )}
                  </View>

                  <View style={{ flex: 1 }} />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    {this.state.tags.flatten() && (
                      <Text
                        style={{
                          paddingLeft: 20,
                          color: "white",
                          fontSize: 18,
                          fontFamily: FONT,
                          fontWeight: "600"
                        }}
                      >
                        {this.state.tags.flatten().name.toTitleCase()}
                      </Text>
                    )}

                    {!this.state.tags.flatten() && (
                      <Text
                        style={{
                          paddingLeft: 20,
                          color: "white",
                          fontSize: 18,
                          fontFamily: FONT,
                          fontWeight: "600"
                        }}
                      >
                        No category
                      </Text>
                    )}
                    <Text
                      style={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        padding: 5,
                        marginLeft: 10,
                        color,
                        fontSize: 12,
                        fontFamily: FONT,
                        fontWeight: "800"
                      }}
                    >
                      {this.state.private ? "PRIVATE" : "PUBLIC"}
                    </Text>
                    <View style={{ flex: 1 }} />
                  </View>

                  <TextInput
                    value={this.state.name}
                    multiline={true}
                    editable={this.state.admin}
                    style={{
                      padding: 20,
                      paddingBottom: 0,
                      zIndex: 3,
                      color: "white",
                      fontSize: 40,
                      fontFamily: FONT,
                      fontWeight: "800"
                    }}
                    onChangeText={name => this.setState({ edit: true, name })}
                  />

                  <TextInput
                    value={this.state.description}
                    multiline={true}
                    editable={this.state.admin}
                    style={{
                      padding: 20,
                      paddingBottom: 40,
                      color: "white",
                      fontSize: 30,
                      fontFamily: FONT,
                      fontWeight: "500"
                    }}
                    onChangeText={description =>
                      this.setState({ edit: true, description })
                    }
                  />

                  <View
                    style={{
                      paddingBottom: 20,
                      zIndex: 2,
                      width,
                      paddingLeft: 20,
                      paddingRight: 20,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center"
                      }}
                    >
                      <AvatarComponent
                        image={
                          this.state.user
                            ? this.state.user.image
                            : this.state.group.image
                        }
                        title={
                          this.state.user
                            ? this.state.user.name
                            : this.state.group.name
                        }
                        size="small"
                      />

                      <View
                        style={{
                          marginLeft: 10,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                          marginRight: 5
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            color: "white",
                            fontFamily: FONT,
                            fontWeight: "600"
                          }}
                        >
                          {this.state.user
                            ? this.state.user.name
                            : this.state.group.name}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flex: 1 }} />

                    <View
                      style={{
                        marginLeft: 10,
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color,
                          fontFamily: FONT,
                          fontWeight: "500"
                        }}
                      >
                        {this.state.members.length}{" "}
                        {this.state.members.length == 1 ? "MEMBER" : "MEMBERS"}
                      </Text>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  addChannel: payload => {
    dispatch(addChannel(payload));
  },

  removeChannel: payload => {
    dispatch(removeChannel(payload));
  },

  updateChannel: (payload, topic) => {
    MQTT.dispatch(topic, updateChannel(payload));
    dispatch(updateChannel(payload));
  },

  updateChannelRemoveMember: (payload, topic) => {
    MQTT.dispatch(topic, updateChannelRemoveMember(payload));
    dispatch(updateChannelRemoveMember(payload));
  },

  updateChannelAddMember: (payload, topic) => {
    MQTT.dispatch(topic, updateChannelAddMember(payload));
    dispatch(updateChannelAddMember(payload));
  }
});

export const ChannelModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelModalRC);
