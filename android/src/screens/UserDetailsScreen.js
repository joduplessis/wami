import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Text,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import { ConfirmModal } from "../modals";
import Icon from "react-native-vector-icons/Feather";
import { loading, menu, error, updateContact, account } from "../actions";
import {
  COLORS,
  S3_PATH,
  FONT,
  API_PATH,
  GQL,
  MQTT,
  CONTACT
} from "../helpers";
import {
  HeadingComponent,
  SubheadingComponent,
  BlockComponent
} from "../components";

const moment = require("moment-timezone");

class UserDetailsScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      task_confirm_modal: false,
      task_name: "",
      task_description: "",
      _id: null,
      email: "",
      name: "",
      image: null,
      contact: "",
      country: "",
      title: null,
      dob: null,
      color: "#2CD1C0",
      timezone: "",
      weight: 0,
      height: 0,
      ethnicity: "",
      gender: "",
      tasks: [],
      userTasksFromCoach: [],
      goals: [],
      conditions: [],
      consultations: []
    };

    this.saveProfileData = this.saveProfileData.bind(this);
    this.fetchScreen = this.fetchScreen.bind(this);
    this.createTask = this.createTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.completeTask = this.completeTask.bind(this);
  }

  componentDidMount() {
    this.fetchScreen();
  }

  fetchScreen() {
    this.fetchClient();
    this.fetchGoals();
  }

  fetchGoals() {
    this.props.updateLoading(true);

    const userId = this.props.navigation.getParam("userId", null);

    GQL.userTasksFromCoach(
      this.props.account._id,
      userId,
      this.props.common.token
    )
      .then(result => result.json())
      .then(result => {
        const { userTasksFromCoach } = result.data;

        this.setState({
          userTasksFromCoach
        });

        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  fetchClient() {
    this.props.updateLoading(true);

    const userId = this.props.navigation.getParam("userId", null);
    const isExpert = this.props.navigation.getParam("isExpert", null);
    const goals = this.props.navigation.getParam("goals", null);
    const consultations = this.props.navigation.getParam("consultations", null);
    const conditions = this.props.navigation.getParam("conditions", null);

    GQL.fetchUser(userId, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { user, userTasks } = result.data;

        const {
          _id,
          email,
          name,
          image,
          contact,
          title,
          country,
          dob,
          color,
          timezone,
          weight,
          height,
          ethnicity,
          gender
        } = user;

        this.setState({
          _id,
          email,
          name,
          image,
          contact,
          title,
          country,
          dob: new Date(dob),
          color,
          timezone,
          weight,
          height,
          ethnicity,
          gender,
          tasks: userTasks,
          isExpert,
          goals,
          conditions,
          consultations
        });

        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  saveProfileData() {
    this.props.updateLoading(true);

    fetch(`${API_PATH}/user/${this.state._id}`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        _id: this.state._id,
        email: this.state.email,
        name: this.state.name,
        image: this.state.image,
        contact: this.state.contact,
        country: this.state.country,
        title: this.state.title,
        dob: this.state.dob,
        color: this.state.color,
        card: this.state.card,
        token: this.state.token,
        timezone: this.state.timezone,
        weight: this.state.weight,
        height: this.state.height,
        ethnicity: this.ethinicities[this.state.ethnicity],
        gender: this.genders[this.state.gender]
      })
    })
      .then(response => response.json())
      .then(data => {
        const {
          _id,
          email,
          name,
          title,
          image,
          contact,
          country,
          dob,
          color,
          card,
          token,
          timezone
        } = this.state;

        // Update all our contact with the new info
        // This is one of the only dispatches that are different to the rest
        // We're expicitly updating ON WILL
        // We do not need to receive this as we are never the contact data we need
        this.props.contacts.map(userContact => {
          this.props.updateContact(MQTT.topic(CONTACT, userContact._id), {
            _id: userContact._id,
            user: {
              _id,
              name,
              image,
              title,
              color
            }
          });
        });

        this.props.updateAccount({
          _id,
          email,
          name,
          title,
          image,
          contact,
          country,
          dob,
          color,
          card,
          token,
          timezone
        });

        this.props.updateLoading(false);
        this.setState({ edit: false });
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(true);
        this.setState({ edit: false });
      });
  }

  completeTask(id) {
    this.props.updateLoading(true);

    fetch(`${API_PATH}/task/${id}`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        completed: true
      })
    })
      .then(response => response.json())
      .then(task => {
        // Return all the tasks first,
        // But update this task as completed
        this.setState({
          tasks: this.state.tasks.map((task, _) => {
            return task._id == id ? { ...task, completed: true } : task;
          })
        });

        // Done!
        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(true);
      });
  }

  deleteTask(id) {
    this.props.updateLoading(true);

    fetch(`${API_PATH}/task/${id}`, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      }
    })
      .then(response => response.json())
      .then(task => {
        // Filter out this ID
        this.setState({
          tasks: this.state.tasks.filter((task, _) => {
            return task._id != id;
          })
        });

        // Done!
        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(true);
      });
  }

  createTask() {
    this.props.updateLoading(true);

    fetch(`${API_PATH}/task`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        user: this.state._id,
        text: this.state.task_name,
        description: this.state.task_description,
        contact: this.props.account._id
      })
    })
      .then(response => response.json())
      .then(task => {
        // Add the task to the list
        this.setState({
          tasks: [...this.state.tasks, task],
          task_name: "",
          task_description: "",
          task_confirm_modal: false
        });

        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(true);
      });
  }

  render() {
    const { height, width } = Dimensions.get("screen");

    if (!this.state._id) return null;

    return (
      <View style={{ flex: 1 }}>
        <ConfirmModal
          visible={this.state.task_confirm_modal}
          placeholder="New task name"
          color={this.state.color}
          text={this.state.task_name}
          updateCallback={text => this.setState({ task_name: text })}
          description={this.state.task_description}
          updateDescriptionCallback={text =>
            this.setState({ task_description: text })
          }
          confirmCallback={this.createTask}
          closeCallback={() =>
            this.setState({ task_name: "", task_confirm_modal: false })
          }
        />

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
            <ScrollView
              style={{ zIndex: 3, backgroundColor: "white", flex: 1 }}
              contentContainerStyle={{ width, paddingBottom: 50 }}
            >
              <View
                style={{
                  zIndex: 6,
                  width,
                  padding: 0,
                  height: 250,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignContent: "flex-start"
                }}
              >
                <Image
                  style={{
                    zIndex: 1,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width,
                    height: 250,
                    tintColor: this.state.color
                  }}
                  source={require("../../assets/images/pattern.png")}
                  resizeMode="cover"
                />

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
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{
                      backgroundColor: this.state.color,
                      padding: 10,
                      borderRadius: 20
                    }}
                  >
                    <Icon name="arrow-left" size={24} color="white" />
                  </TouchableOpacity>

                  <View style={{ flex: 1 }} />

                  {this.state.isExpert && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.color,
                        padding: 10,
                        borderRadius: 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center"
                      }}
                      onPress={() =>
                        this.setState({
                          task_confirm_modal: true,
                          task_name: ""
                        })
                      }
                    >
                      <Text
                        style={{
                          marginRight: 10,
                          color: "white",
                          fontSize: 16,
                          fontFamily: FONT,
                          fontWeight: "600"
                        }}
                      >
                        New goal
                      </Text>

                      <Icon name="check-square" size={20} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={{
                    position: "relative",
                    top: -20,
                    zIndex: 400,
                    width,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <View
                    style={{
                      borderWidth: 10,
                      borderColor: "white",
                      width: 150,
                      height: 150,
                      backgroundColor: this.state.color,
                      borderRadius: 75,
                      padding: 10
                    }}
                  >
                    <Image
                      style={{
                        zIndex: 1,
                        position: "relative",
                        width: 110,
                        height: 110,
                        borderRadius: 55
                      }}
                      source={{ uri: `${S3_PATH}${this.state.image}` }}
                    />
                  </View>
                </View>

                <View style={{ flex: 1 }} />
              </View>

              {this.state.isExpert && (
                <View
                  style={{
                    width,
                    marginBottom: 20,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <HeadingComponent
                    text={this.state.name}
                    style={{ marginTop: 20 }}
                  />

                  <View
                    style={{
                      padding: 5,
                      width,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="inbox" size={20} color={COLORS.DARK.v2} />
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 20,
                        fontFamily: FONT,
                        fontWeight: "600",
                        paddingLeft: 5
                      }}
                    >
                      {this.state.email}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 5,
                      width,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="phone" size={20} color={COLORS.DARK.v2} />
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 20,
                        fontFamily: FONT,
                        fontWeight: "600",
                        paddingLeft: 5
                      }}
                    >
                      {this.state.contact}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 5,
                      width,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 16,
                        fontFamily: FONT,
                        fontWeight: "500",
                        paddingRight: 10
                      }}
                    >
                      {this.state.country}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 16,
                        fontFamily: FONT,
                        fontWeight: "500",
                        paddingRight: 10
                      }}
                    >
                      {this.state.timezone}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 5,
                      width,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 14,
                        fontFamily: FONT,
                        fontWeight: "500",
                        paddingRight: 10
                      }}
                    >
                      {this.state.dob.toLocaleDateString()}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 14,
                        fontFamily: FONT,
                        fontWeight: "500",
                        paddingRight: 10
                      }}
                    >
                      {this.state.height} cm
                    </Text>
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 14,
                        fontFamily: FONT,
                        fontWeight: "500",
                        paddingRight: 10
                      }}
                    >
                      {this.state.weight} kg
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 5,
                      width,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 14,
                        fontFamily: FONT,
                        fontWeight: "500",
                        paddingRight: 10
                      }}
                    >
                      {this.state.gender}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 14,
                        fontFamily: FONT,
                        fontWeight: "500",
                        paddingRight: 10
                      }}
                    >
                      {this.state.ethnicity}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 5,
                      width,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="flag" size={20} color={COLORS.DARK.v2} />
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 20,
                        fontFamily: FONT,
                        fontWeight: "600",
                        paddingLeft: 5
                      }}
                    >
                      {this.state.goals.join(", ")}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 5,
                      width,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="activity" size={20} color={COLORS.DARK.v2} />
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 20,
                        fontFamily: FONT,
                        fontWeight: "600",
                        paddingLeft: 5
                      }}
                    >
                      {this.state.conditions.join(", ")}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 5,
                      width,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="clock" size={20} color={COLORS.DARK.v2} />
                    <Text
                      style={{
                        color: COLORS.DARK.v2,
                        fontSize: 20,
                        fontFamily: FONT,
                        fontWeight: "600",
                        paddingLeft: 5
                      }}
                    >
                      {this.state.consultations.join(", ")}
                    </Text>
                  </View>
                </View>
              )}

              {this.state.userTasksFromCoach.length != 0 && (
                <View
                  style={{
                    padding: 5,
                    paddingBottom: 5,
                    width,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <HeadingComponent
                    text="Your Goals"
                    style={{ marginTop: 20 }}
                  />
                </View>
              )}

              {this.state.userTasksFromCoach.length != 0 && (
                <View
                  style={{
                    zIndex: 3,
                    padding: 0,
                    paddingTop: 30,
                    width,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignContent: "flex-start"
                  }}
                >
                  {this.state.userTasksFromCoach
                    .filter((task, _) => {
                      return !task.completed;
                    })
                    .map((task, index) => {
                      return (
                        <BlockComponent
                          key={index}
                          title={task.text}
                          color={this.state.color}
                          subtitle={task.description}
                          action={() => null}
                        />
                      );
                    })}
                </View>
              )}

              {this.state.tasks.length != 0 && (
                <View
                  style={{
                    padding: 5,
                    paddingBottom: 10,
                    width,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <Text
                    style={{
                      color: this.state.color,
                      fontSize: 26,
                      fontFamily: FONT,
                      fontWeight: "700"
                    }}
                  >
                    Goals For This Client
                  </Text>
                </View>
              )}

              {this.state.tasks.map((task, index) => {
                // Only return this coach's tasks
                if (task.contact._id != this.props.account._id) return null;

                return (
                  <View
                    key={index}
                    style={{
                      width,
                      padding: 20,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{
                          flex: 1,
                          textDecorationLine: task.completed
                            ? "line-through"
                            : "none",
                          textDecorationStyle: "solid",
                          color: COLORS.DARK.v2,
                          fontSize: 20,
                          fontFamily: FONT,
                          fontWeight: "800",
                          marginLeft: 10
                        }}
                      >
                        {task.text}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{
                          flex: 1,
                          textDecorationLine: task.completed
                            ? "line-through"
                            : "none",
                          textDecorationStyle: "solid",
                          color: COLORS.DARK.v2,
                          fontSize: 15,
                          fontFamily: FONT,
                          fontWeight: "500",
                          marginLeft: 10
                        }}
                      >
                        {task.description}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => this.completeTask(task._id)}
                      style={{ marginLeft: 10 }}
                    >
                      <Icon name="check" size={22} color={COLORS.DARK.v2} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.deleteTask(task._id)}
                      style={{ marginLeft: 10 }}
                    >
                      <Icon name="x" size={22} color={COLORS.DARK.v2} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account,
  contacts: state.contacts
});

const mapDispatchToProps = dispatch => ({
  updateError: text => {
    dispatch(error(text));
  },

  updateMenu: open => {
    dispatch(menu(open));
  },

  updateLoading: busy => {
    dispatch(loading(busy));
  },

  updateContact: (topic, partialContact) => {
    MQTT.dispatch(topic, updateContact(partialContact));
  },

  updateAccount: data => {
    dispatch(account(data));
  }
});

export const UserDetailsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetailsScreenRC);
