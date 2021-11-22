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
  ActionSheetIOS,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {
  SectionHeadingComponent,
  ButtonComponent,
  BookingComponent,
  LoadingComponent,
  ErrorComponent,
  SubheadingComponent,
  HeadingComponent
} from "../components";
import { CoachWizardModal } from "./";
import { connect } from "react-redux";
import {
  addContact,
  removeContact,
  updateContactStatus,
  addEvent
} from "../actions";
import {
  API_PATH,
  S3_PATH,
  CONTACT_REQUEST_CONFIRMED,
  CONTACT_REQUEST_UNCONFIRMED,
  CONTACT_REQUEST_PENDING,
  CONTACT_NOT_REQUESTED,
  MQTT,
  CONTACT,
  COLORS,
  FONT
} from "../helpers";
import { connectActionSheet } from '@expo/react-native-action-sheet';

const moment = require("moment-timezone");

class UserModalRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      booking_modal: false,
      coach_wizard_modal: false,
      loaded: false,
      error: null,
      loading: null,
      contactStatus: null,

      // User properties
      _id: "",
      contact: "",
      image: "https://joduplessis.com/hoola/category1.jpg",
      background: "https://joduplessis.com/hoola/category1.jpg",
      name: "",
      description: "",
      rating: 0,
      calendar: null,
      title: "",
      address: "",
      color: "white",
      tags: [],
      time: "",
      calendar: null,
      userContact: null,
      availabilities: [],
      userRating: 0
    };

    this.closeCallback = this.closeCallback.bind(this);
    this.addContact = this.addContact.bind(this);
    this.removeContact = this.removeContact.bind(this);
    this.cancelContact = this.cancelContact.bind(this);
    this.confirmContact = this.confirmContact.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.removeAvailability = this.removeAvailability.bind(this);
    this.toggleEventType = this.toggleEventType.bind(this);
    this.toggleBooking = this.toggleBooking.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.contactStatus = this.contactStatus.bind(this);
  }

  toggleError() {
    this.setState({
      error: false
    });
  }

  contactStatus(contact) {
    if (contact == null) return CONTACT_NOT_REQUESTED;

    if (contact.user._id == this.props.account._id && !contact.confirmed) {
      return CONTACT_REQUEST_UNCONFIRMED;
    } else if (
      contact.contact._id == this.props.account._id &&
      !contact.confirmed
    ) {
      return CONTACT_REQUEST_PENDING;
    } else if (contact.confirmed) {
      return CONTACT_REQUEST_CONFIRMED;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      if (nextProps.user.user._id != this.state._id) {
        const { user, userAvailability, userRating } = nextProps.user;

        const {
          _id,
          contact,
          image,
          background,
          name,
          description,
          rating,
          title,
          address,
          color,
          tags,
          calendar
        } = user;

        const userContact = this.props.contacts
          .filter(contact => {
            return (
              (contact.contact._id == _id &&
                contact.user._id == this.props.account._id) ||
              (contact.contact._id == this.props.account._id &&
                contact.user._id == _id)
            );
          })
          .flatten();

        this.setState({
          _id,
          contact,
          image,
          background,
          name,
          description,
          rating,
          title,
          address,
          color,
          tags,
          calendar,
          userRating,
          loaded: true,
          userContact,
          contactStatus: this.contactStatus(userContact),

          // Shift all these to the correct timezone
          availabilities: userAvailability
            ? userAvailability.map((available, _) => {
                // Get the time from the server that is marked with the timezone it falls in
                const time = moment.tz(
                  available,
                  "MM/DD/YYYY hh:mm:ss",
                  calendar.timezone
                );

                // We create the new time that is based on this user's timezone
                // Any time that is now sent back to the server will be nuetralized to be UTC compliant
                const otime = time
                  .clone()
                  .tz(this.props.account.timezone)
                  .format();

                return otime;
              })
            : null
        });
      }
    }
  }

  closeCallback() {
    this.setState({
      time: "",
      _id: null
    });

    this.props.closeCallback();
  }

  cancelContact() {
    // Other person hasn't replied yet
    // So just remove it
    this.removeContact();
  }

  addContact() {
    fetch(`${API_PATH}/contact`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        user: this.props.account._id,
        contact: this.state._id
      })
    })
      .then(response => response.json())
      .then(contact => {
        // This will add it to our store & also
        // Signal the API to send the contact to the other person
        // we do it immeditaely thouh
        this.props.addContact(contact);

        // Update the contact state for this modal
        this.setState({
          contactStatus: CONTACT_REQUEST_UNCONFIRMED
        });
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  removeContact() {
    // Get the contact from our contacts store fro this user
    const userContact = this.props.contacts
      .filter(contact => {
        return (
          (contact.contact._id == this.state._id &&
            contact.user._id == this.props.account._id) ||
          (contact.contact._id == this.props.account._id &&
            contact.user._id == this.state._id)
        );
      })
      .flatten();

    fetch(`${API_PATH}/contact/${userContact._id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      }
    })
      .then(response => response.json())
      .then(contact => {
        // This will remove this from ourside,
        // But also will tell the API to notify the
        // other person to delete the contact
        this.props.removeContact(userContact._id);

        // Update the contact state for this modal,
        // The contact won't be there though
        this.setState({
          contactStatus: CONTACT_NOT_REQUESTED
        });

        // Tell the user
        Alert.alert(
          "Completed!",
          "You will not be charged at out next billing run"
        );
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  confirmContact() {
    // Get the contact from our contacts store
    let userContact = this.props.contacts
      .filter(contact => {
        return (
          (contact.contact._id == this.state._id &&
            contact.user._id == this.props.account._id) ||
          (contact.contact._id == this.props.account._id &&
            contact.user._id == this.state._id)
        );
      })
      .flatten();

    fetch(`${API_PATH}/contact/${userContact._id}/confirm`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        confirmed: true
      })
    })
      .then(response => response.json())
      .then(contact => {
        // And we'll update our Redux Store ourself
        // Because we don't receive MQTT messages we send ourself
        this.props.updateContactStatus(
          {
            contact: userContact._id,
            confirmed: true
          },
          MQTT.topic(CONTACT, contact._id)
        );

        // Update this state
        this.setState({
          contactStatus: CONTACT_REQUEST_CONFIRMED
        });
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  createEvent(offline, start) {
    fetch(`${API_PATH}/event`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        user_id: this.props.account._id,
        expert_id: this.state._id,
        start_time: start,
        is_offline: offline
      })
    })
      .then(response => response.json())
      .then(event => {
        Alert.alert(
          "Congratulations!",
          "Your booking has been made. You can view this event in the drawer menu."
        );

        // First we add the event to our own store
        this.props.addEvent(event);

        // Finally we remove the time on the state,
        // This is so the user can't reselect it
        this.removeAvailability(this.state.time);
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  removeAvailability(time) {
    this.setState({
      availabilities: this.state.availabilities.filter(availability => {
        return (
          availability !=
          moment(time)
            .tz(this.props.account.timezone)
            .format()
        );
      })
    });
  }

  toggleEventType(time) {
    // Do nothing here - we simply want to dispplay the times
    // return;

    if (this.state.time == time) {
      this.setState({
        time: ""
      });
    } else {
      this.setState({
        time
      });

      this.props.showActionSheetWithOptions(
        {
          options: ["Cancel", "On Wami", "At their address"],
          title: "Select Location",
          message: "Where do you want to meet this expert?",
          cancelButtonIndex: 0,
          destructiveButtonIndex: 1
        },
        index => {
          if (index != 0) {
            this.createEvent(index == 2 ? true : false, this.state.time);
          } else {
            this.setState({ time: null });
          }
        }
      );
    }
  }

  toggleBooking() {
    this.setState({
      booking_modal: !this.state.booking_modal
    });
  }

  componentDidMount() {
    setTimeout(() => {
      // this.setState({ coach_wizard_modal: true });
    }, 1000);
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    if (!this.state.loaded) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.closeCallback();
        }}
      >
        <CoachWizardModal
          coachId={this.state._id}
          tag={this.props.tag}
          visible={this.state.coach_wizard_modal}
          closeCallback={() => this.setState({ coach_wizard_modal: false })}
          parentCloseCallback={this.closeCallback}
        />

        <ErrorComponent visible={this.state.error} action={this.toggleError} />

        <LoadingComponent visible={this.state.loading} />

        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.85)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              position: "relative",
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
                  paddingTop: 10,
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
                    onPress={this.closeCallback}
                    style={{
                      backgroundColor: this.state.color,
                      padding: 10,
                      borderRadius: 20
                    }}
                  >
                    <Icon name="x" size={24} color="white" />
                  </TouchableOpacity>

                  <View style={{ flex: 1 }} />
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

              {this.state.calendar && (
                <View
                  style={{
                    padding: 20,
                    paddingBottom: 0,
                    zIndex: 3,
                    width,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <View
                    style={{
                      backgroundColor: this.state.color,
                      borderRadius: 20,
                      padding: 10,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontFamily: FONT,
                        fontWeight: "600"
                      }}
                    >
                      COST PER MONTH
                    </Text>
                    <Text
                      style={{
                        paddingLeft: 10,
                        color: "white",
                        fontSize: 14,
                        fontFamily: FONT,
                        fontWeight: "800"
                      }}
                    >
                      R{this.state.calendar.rate}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }} />

                  {this.state._id != this.props.account._id && (
                    <View>
                      {this.state.contactStatus == CONTACT_REQUEST_CONFIRMED &&
                        this.state.userContact.contact._id !=
                          this.props.account._id && (
                          <ButtonComponent
                            title="Remove as Coach"
                            solid={true}
                            color={this.state.color}
                            action={this.removeContact}
                            style={{ padding: 0 }}
                          />
                        )}
                      {this.state.contactStatus ==
                        CONTACT_REQUEST_UNCONFIRMED && (
                        <ButtonComponent
                          title="Cancel Coach Request"
                          solid={true}
                          color={this.state.color}
                          action={this.cancelContact}
                        />
                      )}
                      {this.state.contactStatus == CONTACT_REQUEST_PENDING && (
                        <ButtonComponent
                          title="Confirm"
                          solid={true}
                          color={this.state.color}
                          action={this.confirmContact}
                        />
                      )}
                      {this.state.contactStatus == CONTACT_NOT_REQUESTED && (
                        <ButtonComponent
                          title="Add As Coach"
                          solid={true}
                          color={this.state.color}
                          action={() =>
                            this.setState({ coach_wizard_modal: true })
                          }
                          style={{ padding: 0 }}
                          //action={this.addContact}
                        />
                      )}
                    </View>
                  )}
                </View>
              )}

              <View style={{ padding: 20, paddingBottom: 0, width }}>
                <HeadingComponent
                  text={this.state.name}
                  size={30}
                  color={this.state.color}
                />

                <HeadingComponent
                  text={this.state.title}
                  size={18}
                  color={this.state.color}
                />
              </View>

              {this.state.calendar && (
                <View
                  style={{
                    marginTop: 10,
                    paddingRight: 20,
                    paddingLeft: 20,
                    width,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <Icon name="map-pin" size={20} color={COLORS.DARK.v3} />

                  <SubheadingComponent
                    title={this.state.calendar.address}
                    color={COLORS.DARK.v3}
                    style={{ flex: 1, paddingLeft: 5 }}
                  />
                </View>
              )}

              <View
                style={{
                  padding: 20,
                  paddingTop: 20,
                  width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  alignContent: "center"
                }}
              >
                <SubheadingComponent
                  title="Coach Bio"
                  color={COLORS.DARK.v3}
                  style={{ marginBottom: 5 }}
                />

                <HeadingComponent
                  text={this.state.description}
                  size={16}
                  color={COLORS.DARK.v2}
                />
              </View>

              {this.state.availabilities && (
                <View
                  style={{
                    padding: 20,
                    paddingTop: 0,
                    paddingBottom: 50,
                    width,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    alignContent: "center"
                  }}
                >
                  <SubheadingComponent
                    title="Appointment availability"
                    color={COLORS.DARK.v3}
                    style={{ marginBottom: 5 }}
                  />

                  <HeadingComponent
                    text="Please note, these items are tentative. It is up to your coach to create an appointment with you."
                    size={16}
                    color={COLORS.DARK.v2}
                  />

                  <View
                    style={{
                      width: width - 40,
                      marginTop: 20,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      alignContent: "flex-start"
                    }}
                  >
                    {this.state.availabilities
                      .slice(0, 5)
                      .map((availability, index) => {
                        const time = moment(availability)
                          .tz(this.props.account.timezone)
                          .toISOString();
                        const displayTime = moment(availability)
                          .tz(this.props.account.timezone)
                          .format("ddd MMM DD HH:mm");
                        const selected = time == this.state.time;

                        return (
                          <BookingComponent
                            key={index}
                            selected={selected}
                            time={time}
                            displayTime={displayTime}
                            bookingCallback={this.toggleEventType}
                          />
                        );
                      })}

                    {this.state.availabilities.slice(0, 5).length == 0 && (
                      <Text
                        style={{
                          color: "#C5C5D2",
                          fontFamily: FONT,
                          fontWeight: "400",
                          fontSize: 20
                        }}
                      >
                        No available slots today
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  contacts: state.contacts,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  addContact: payload => {
    dispatch(addContact(payload));
  },

  removeContact: payload => {
    dispatch(removeContact(payload));
  },

  updateContactStatus: (payload, topic) => {
    MQTT.dispatch(topic, updateContactStatus(payload));
    dispatch(updateContactStatus(payload));
  },

  addEvent: payload => {
    dispatch(addEvent(payload));
  },

  updateError: payload => {
    dispatch(error(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  }
});

export const UserModal = connectActionSheet(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserModalRC));
