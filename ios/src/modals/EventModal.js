import React from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  DatePickerAndroid,
  TextInput,
  Dimensions,
  Modal,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {
  AvatarComponent,
  ErrorComponent,
  LoadingComponent
} from "../components";
import {
  API_PATH,
  DECLINED,
  CONFIRMED,
  INVITED,
  EVENT,
  MQTT,
  FONT,
  EventFactory
} from "../helpers";
import { connect } from "react-redux";
import {
  eventIncoming,
  removeEvent,
  updateEvent,
  updateEventAddAttendee,
  updateEventAttendee,
  updateEventRemoveAttendee
} from "../actions";
import { DateModal } from "./";

const moment = require("moment-timezone");

export class EventModalRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map_modal: false,
      rate_modal: false,
      event_attendees_modal: false,
      date_modal: false,
      edit: false,
      error: null,
      loading: false,
      loaded: false,

      // Event properties
      _id: "",
      location: null,
      notes: null,
      processed: false,
      rate: 0,
      address: null,
      start: null,
      end: null,
      offline: false,
      mandatory: false,
      owner: null,
      expert: null,
      calendar: null,
      eventOwner: null,
      eventExpert: null,
      attendees: [],
      eventExpertConfirmed: null,
      userStatus: "",
      allAttendeesConfirmed: null,
      time: null
    };

    this.updateCoordinates = this.updateCoordinates.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.attendance = this.attendance.bind(this);
    this.processEvent = this.processEvent.bind(this);
    this.startVideo = this.startVideo.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.closeCallback = this.closeCallback.bind(this);
    this.openDateModal = this.openDateModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.event) {
      const { attendees, expert } = nextProps.event;

      // If the expert has confirmed
      const eventExpertConfirmed =
        attendees.filter(attendee => {
          return (
            expert._id == attendee.user._id && attendee.status == "CONFIRMED"
          );
        }).length == 1;

      // If this user has confirmed
      const userStatus = attendees
        .filter(attendee => {
          return this.props.account._id == attendee.user._id;
        })
        .flatten()
        .status.toUpperCase();

      // If all people are confirmed
      const allAttendeesConfirmed = attendees.every(attendee => {
        return attendee.status == "CONFIRMED";
      });

      // Process this only if it's new
      if (nextProps.event._id != this.state._id) {
        const {
          _id,
          location,
          notes,
          processed,
          rate,
          address,
          start,
          end,
          offline,
          mandatory,
          owner,
          expert,
          calendar
        } = nextProps.event;

        // Is this user is the event owner
        const eventOwner = owner._id == this.props.account._id ? true : false;

        // Is this user is the event owner
        const eventExpert = expert._id == this.props.account._id ? true : false;

        // Get the correct timezoned date
        const date = moment(start).tz(this.props.account.timezone);
        const today = moment(new Date());
        const isEventToday = date.isSame(today, "d");
        const time = isEventToday
          ? date.format("h:mm a")
          : date.format("MMM Do h:mm");

        // Update our state
        this.setState({
          _id,
          location,
          notes,
          processed,
          rate,
          address,
          start: moment(start).tz(this.props.account.timezone),
          end: moment(end).tz(this.props.account.timezone),
          offline,
          mandatory,
          owner,
          expert,
          calendar,
          loaded: true,
          eventOwner,
          eventExpert,
          time,
          attendees,
          eventExpertConfirmed,
          userStatus,
          allAttendeesConfirmed
        });
      }
    }
  }

  startVideo() {
    const { owner, expert } = this.state;
    const contact = this.props.contacts
      .filter(
        contact =>
          contact.contact._id == expert._id && contact.user._id == owner._id
      )
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

        this.closeCallback();
      })
      .catch(error => {
        this.props.updateError(error);
      });
  }

  componentDidMount() {}

  updateDate(start) {
    // Get the correct timezoned date
    const date = moment(start).tz(this.props.account.timezone);
    const today = moment(new Date());
    const isEventToday = date.isSame(today, "d");
    const time = isEventToday
      ? date.format("h:mm a")
      : date.format("MMM Do h:mm");

    this.setState({
      time,
      edit: true,
      start: moment(start).tz(this.props.account.timezone),
      end: moment(start)
        .clone()
        .add(this.state.calendar.interval, "minutes")
        .tz(this.props.account.timezone)
    });
  }

  processEvent() {
    this.setState({
      loading: true
    });

    fetch(`${API_PATH}/event/${this.state._id}/process`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();

        return Promise.all([statusCode, data]);
      })
      .then(([statusCode, data]) => {
        if (statusCode != 200) {
          console.log(data);
          this.setState({
            processed: false,
            loading: false,
            error: true
          });
          return;
        }

        // We update the vent
        this.props.updateEvent(
          {
            _id: this.state._id,
            processed: true
          },
          MQTT.topic(EVENT, this.state._id)
        );

        this.setState({
          processed: true,
          loading: false
        });

        // Close the window
        this.closeCallback();
      })
      .catch(error => {
        this.setState({
          error,
          loading: false
        });
      });
  }

  updateCoordinates(coordinates) {
    this.setState({
      loading: true
    });

    const { longitude, latitude } = coordinates;
    const key = "AIzaSyAHI1WlKwZ5exlrvSN_XjWaZgn2k4HV0qQ";
    const url = `https://maps.google.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}&sensor=false`;

    fetch(url)
      .then(response => response.json())
      .then(json => {
        const { results, status } = json;

        if (status != "ZERO RESULTS") {
          const { formatted_address } = results[0];

          this.setState({
            loading: false,
            location: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            edit: true,
            address: formatted_address,
            map_modal: false
          });
        } else {
          Alert.alert(
            "Sorry",
            "We couldn't find this address for you, please enter it manually."
          );

          this.setState({
            loading: false,
            edit: true,
            address: "23 Wami Street, WA",
            map_modal: false
          });
        }
      })
      .catch(error => {
        this.setState({
          loading: false,
          error
        });
      });
  }

  deleteEvent() {
    Alert.alert(
      "Hold on!",
      "Are you sure you want to delete this event (can not be undone)?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => this.deleteEventAction() }
      ],
      { cancelable: true }
    );
  }

  deleteEventAction() {
    fetch(`${API_PATH}/event/${this.state._id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      }
    })
      .then(response => response.json())
      .then(event => {
        // We remove it from our store
        // This will send an action to all attendees to delete it
        // We do it right now though
        this.props.removeEvent(this.state._id);

        // Close the window
        this.closeCallback();
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  attendance(status) {
    fetch(`${API_PATH}/event/${this.state._id}/attendee/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        user: this.props.account._id,
        status: status
      })
    })
      .then(response => response.json())
      .then(att => {
        const attendees = this.state.attendees.map((attendee, _) => {
          return attendee.user._id == this.props.account._id
            ? {
                // We're only updating the status here,
                // We keep the user object in tact
                user: attendee.user,
                status: status
              }
            : attendee;
        });

        // If this user has confirmed
        const userStatus = status;

        // If all people are confirmed
        const allAttendeesConfirmed = attendees.every(attendee => {
          return attendee.status == "CONFIRMED";
        });

        // Update the attendees here, we update our list with
        // We only update the status of our state
        this.setState({
          userStatus,
          attendees,
          allAttendeesConfirmed
        });

        // Send the update ATTENDEE & event _id: this update our Redux store
        // and also will update everyone elses store
        this.props.updateEventAttendee(
          {
            event: this.state._id,
            attendee: this.props.account._id,
            status: status
          },
          MQTT.topic(EVENT, this.state._id)
        );
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  saveEvent() {
    fetch(`${API_PATH}/event/${this.state._id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        notes: this.state.notes,
        rate: this.state.rate,
        address: this.state.address,
        start: this.state.start.toISOString(),
        end: this.state.end.toISOString(),
        location: {
          type: "Point",
          coordinates: this.state.location.coordinates
        },
        offline: this.state.address == "" ? false : true
      })
    })
      .then(response => response.json())
      .then(res => {
        // Update our side
        this.props.updateEvent(
          {
            _id: this.state._id,
            notes: this.state.notes,
            start: this.state.start.toISOString()
          },
          MQTT.topic(EVENT, this.state._id)
        );

        // Done!
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

  closeCallback() {
    this.props.closeCallback();
    this.setState({
      _id: null,
      attendees: []
    });
  }

  async openAndroidDateModal() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.dob
      });

      if (action !== DatePickerAndroid.dismissedAction)
        this.updateDate(new Date(year, month, day));
    } catch ({ code, message }) {}
  }

  openDateModal() {
    if (Platform.OS == "ios") this.setState({ date_modal: true });
    if (Platform.OS == "android") this.openAndroidDateModal();
  }

  render() {
    if (!this.state.loaded) return null;

    const { width, height } = Dimensions.get("screen");

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.closeCallback}
      >
        <DateModal
          visible={this.state.date_modal}
          closeCallback={() => this.setState({ date_modal: false })}
          selectCallback={() => this.setState({ date_modal: false })}
          updateCallback={this.updateDate}
          date={this.state.start}
          datetime="datetime"
        />

        <ErrorComponent
          visible={this.state.error}
          action={() => this.setState({ error: null })}
        />

        <LoadingComponent visible={this.state.loading} />

        <View
          style={{
            backgroundColor: this.state.expert.color,
            width,
            height,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                width,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                padding: 20,
                paddingTop: 40
              }}
            >
              <TouchableOpacity
                onPress={this.closeCallback}
                style={{
                  marginRight: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <Icon name="x" size={24} color="white" />
              </TouchableOpacity>

              {this.state.userStatus == CONFIRMED && (
                <TouchableOpacity
                  onPress={() => this.attendance(DECLINED)}
                  style={{
                    padding: 10,
                    borderRadius: 20,
                    marginRight: 3,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: this.state.expert.color,
                      fontFamily: FONT,
                      fontWeight: "800"
                    }}
                  >
                    DECLINE
                  </Text>
                </TouchableOpacity>
              )}

              {this.state.userStatus == INVITED && (
                <TouchableOpacity
                  onPress={() => this.attendance(DECLINED)}
                  style={{
                    padding: 10,
                    borderRadius: 20,
                    marginRight: 3,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: this.state.expert.color,
                      fontFamily: FONT,
                      fontWeight: "800"
                    }}
                  >
                    DECLINE
                  </Text>
                </TouchableOpacity>
              )}

              {this.state.userStatus == INVITED && (
                <TouchableOpacity
                  onPress={() => this.attendance(CONFIRMED)}
                  style={{
                    padding: 10,
                    borderRadius: 20,
                    marginRight: 3,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: this.state.expert.color,
                      fontFamily: FONT,
                      fontWeight: "800"
                    }}
                  >
                    ACCEPT
                  </Text>
                </TouchableOpacity>
              )}

              {this.state.userStatus == DECLINED && (
                <TouchableOpacity
                  onPress={() => this.attendance(CONFIRMED)}
                  style={{
                    padding: 10,
                    borderRadius: 20,
                    marginRight: 3,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: this.state.expert.color,
                      fontFamily: FONT,
                      fontWeight: "800"
                    }}
                  >
                    ACCEPT
                  </Text>
                </TouchableOpacity>
              )}

              <View
                style={{
                  paddingLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  alignContent: "flex-start"
                }}
              >
                {this.state.userStatus == "CONFIRMED" && (
                  <Icon name="check" size={14} color="white" />
                )}
                {this.state.userStatus == "INVITED" && (
                  <Icon name="help-circle" size={14} color="white" />
                )}
                {this.state.userStatus == "DECLINED" && (
                  <Icon name="x" size={14} color="white" />
                )}

                <Text
                  style={{
                    paddingLeft: 5,
                    color: "white",
                    fontSize: 12,
                    fontFamily: FONT,
                    fontWeight: "800"
                  }}
                >
                  {this.state.userStatus}
                </Text>
              </View>

              <View style={{ flex: 1 }} />

              {this.state.edit && (
                <TouchableOpacity
                  onPress={this.saveEvent}
                  style={{
                    marginRight: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <Icon name="save" size={20} color="white" />
                </TouchableOpacity>
              )}

              {this.state.eventOwner ||
                (this.state.eventExpert && (
                  <TouchableOpacity
                    onPress={this.deleteEvent}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="trash" size={20} color="white" />
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <View style={{ flex: 1 }} />

              <View style={{ padding: 20, width }}>
                <TouchableOpacity
                  onPress={() => this.setState({ event_attendees_modal: true })}
                  style={{
                    paddingBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <Icon name="user-check" size={18} color={"white"} />

                  <Text
                    style={{
                      paddingLeft: 5,
                      fontSize: 12,
                      color: "white",
                      fontFamily: FONT,
                      fontWeight: "800"
                    }}
                  >
                    {this.state.attendees.length} PEOPLE{" "}
                    {this.state.allAttendeesConfirmed ? "" : "(PENDING)"}
                  </Text>

                  <View style={{ flex: 1 }} />
                </TouchableOpacity>

                <KeyboardAvoidingView behavior="padding" enabled>
                  <View
                    style={{
                      paddingBottom: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <TextInput
                      multiline={true}
                      numberOfLines={2}
                      editable={this.state.eventExpert}
                      onChangeText={notes =>
                        this.setState({ edit: true, notes })
                      }
                      style={{
                        flex: 1,
                        fontSize: 40,
                        lineHeight: 42,
                        color: "white",
                        fontFamily: FONT,
                        fontWeight: "400"
                      }}
                      value={this.state.notes}
                    />
                  </View>

                  {this.state.offline && (
                    <View
                      style={{
                        paddingBottom: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        alignContent: "center"
                      }}
                    >
                      <TextInput
                        multiline={true}
                        numberOfLines={2}
                        editable={this.state.eventExpert}
                        onChangeText={address =>
                          this.setState({ edit: true, address })
                        }
                        style={{
                          flex: 1,
                          fontSize: 25,
                          color: "white",
                          fontFamily: FONT,
                          fontWeight: "400"
                        }}
                        value={this.state.address}
                      />
                    </View>
                  )}
                </KeyboardAvoidingView>

                {/*
                                {this.state.offline && this.state.eventExpert &&
                                    <TouchableOpacity onPress={() => this.setState({ map_modal: true })} style={{opacity: 0.5,  paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                                        <Icon name="map-pin" size={16} color="white" />
                                        <Text style={{paddingLeft: 5, flex: 1, fontSize: 25, color: 'white', fontFamily: FONT, fontWeight: '400'}}>
                                            Update address
                                        </Text>
                                    </TouchableOpacity>
                                }
                                */}

                {this.state.start && (
                  <TouchableOpacity
                    onPress={() =>
                      this.state.eventExpert ? this.this.openDateModal() : null
                    }
                    style={{
                      paddingTop: 10,
                      paddingBottom: 20,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="calendar" size={16} color="white" />
                    <Text
                      style={{
                        paddingLeft: 5,
                        flex: 1,
                        fontSize: 20,
                        color: "white",
                        fontFamily: FONT,
                        fontWeight: "400"
                      }}
                    >
                      {this.state.time}
                    </Text>
                  </TouchableOpacity>
                )}

                {!this.state.start && this.state.eventExpert && (
                  <TouchableOpacity
                    onPress={this.openDateModal}
                    style={{
                      opacity: 0.5,
                      paddingBottom: 20,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="calendar" size={16} color="white" />
                    <Text
                      style={{
                        paddingLeft: 5,
                        flex: 1,
                        fontSize: 20,
                        color: "white",
                        fontFamily: FONT,
                        fontWeight: "600"
                      }}
                    >
                      ADD DATE
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={{ flex: 1 }} />

              <View
                style={{
                  padding: 20,
                  paddingBottom: 0,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <AvatarComponent
                  title={this.state.expert.name}
                  image={this.state.expert.image}
                  style={{ marginRight: 2 }}
                  size="x-small"
                />

                <View
                  style={{
                    flex: 1,
                    paddingLeft: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <Text
                    style={{
                      paddingRight: 4,
                      fontSize: 12,
                      color: "white",
                      fontFamily: FONT,
                      fontWeight: "800"
                    }}
                  >
                    EXPERT
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "white",
                      fontFamily: FONT,
                      fontWeight: "600"
                    }}
                  >
                    {this.state.expert.name.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  padding: 20,
                  paddingTop: 10
                }}
              >
                {!this.state.processed && this.state.eventExpert && (
                  <TouchableOpacity
                    onPress={this.processEvent}
                    style={{
                      margin: 5,
                      marginLeft: 0,
                      flex: 1,
                      borderColor: "white",
                      borderWidth: 2,
                      borderRadius: 20,
                      padding: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="check" size={14} color="white" />
                    <Text
                      style={{
                        paddingLeft: 7,
                        fontSize: 12,
                        color: "white",
                        fontFamily: FONT,
                        fontWeight: "800"
                      }}
                    >
                      COMPLETED
                    </Text>
                  </TouchableOpacity>
                )}

                {this.state.eventExpert && (
                  <TouchableOpacity
                    onPress={this.startVideo}
                    style={{
                      margin: 5,
                      marginRight: 0,
                      flex: 1,
                      borderColor: "white",
                      borderWidth: 2,
                      borderRadius: 20,
                      padding: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center"
                    }}
                  >
                    <Icon name="video" size={14} color="white" />
                    <Text
                      style={{
                        paddingLeft: 7,
                        fontSize: 12,
                        color: "white",
                        fontFamily: FONT,
                        fontWeight: "800"
                      }}
                    >
                      VIDEO CALL
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account,
  events: state.events,
  contacts: state.contacts
});

const mapDispatchToProps = dispatch => ({
  eventOpen: () => {
    dispatch(eventIncoming(true));
  },

  removeEvent: payload => {
    dispatch(removeEvent(payload));
  },

  updateEvent: (payload, topic) => {
    MQTT.dispatch(topic, updateEvent(payload));
    dispatch(updateEvent(payload));
  },

  updateEventAttendee: (payload, topic) => {
    MQTT.dispatch(topic, updateEventAttendee(payload));
    dispatch(updateEventAttendee(payload));
  },

  updateEventRemoveAttendee: (payload, topic) => {
    MQTT.dispatch(topic, updateEventRemoveAttendee(payload));
    dispatch(updateEventRemoveAttendee(payload));
  },

  updateEventAddAttendee: (payload, topic) => {
    MQTT.dispatch(topic, updateEventAddAttendee(payload));
    dispatch(updateEventAddAttendee(payload));
  }
});

export const EventModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventModalRC);
