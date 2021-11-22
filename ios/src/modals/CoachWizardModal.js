import React from "react";
import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
  AlertIOS
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {
  ButtonComponent,
  LoadingComponent,
  ErrorComponent,
  SliderComponent,
  IconComponent,
  SubheadingComponent,
  HeadingComponent
} from "../components";
import { ExpiryModal, CardModal } from "./";
import { connect } from "react-redux";
import {
  addContact,
  removeContact,
  updateContactStatus,
  addEvent,
  loading,
  error
} from "../actions";
import {
  API_PATH,
  COLORS,
  CONTACT_REQUEST_CONFIRMED,
  CONTACT_NOT_REQUESTED,
  MQTT,
  CONTACT,
  GQL
} from "../helpers";
import { UnreadSchema } from "../schemas";
import Realm from "realm";

const moment = require("moment-timezone");

class CoachWizardRC extends React.Component {
  constructor(props) {
    super(props);

    this.conditions = [
      "Hypertension",
      "Cancer",
      "Heart disease",
      "Depression",
      "Weight"
    ];
    this.goals = [
      "Weight loss",
      "Stress management",
      "Fitness",
      "Better nutrition",
      "General wellness",
      "Kids Health",
      "Sports Nutrition"
    ];
    this.consultations = [
      "6AM - 8AM",
      "8AM - 10AM",
      "10AM - 12PM",
      "12PM - 2PM",
      "2PM - 4PM",
      "4PM - 6PM",
      "6PM - 8PM"
    ];

    this.state = {
      date_modal: false,
      card_modal: false,
      error: null,
      loading: null,
      current: 0,
      users: [],
      coach: "",
      tag: "",
      goals: [],
      conditions: [],
      consultations: [],
      name: null,
      number: null,
      cvv: null,
      vendor: null,
      month: null,
      year: null
    };

    this.addContact = this.addContact.bind(this);
    this.removeContact = this.removeContact.bind(this);
    this.cancelContact = this.cancelContact.bind(this);
    this.confirmContact = this.confirmContact.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.updateMonth = this.updateMonth.bind(this);
    this.updateYear = this.updateYear.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }

  clearFields() {
    this.setState({
      date_modal: false,
      card_modal: false,
      error: null,
      loading: null,
      current: 0,
      users: [],
      coach: "",
      tag: "",
      goals: [],
      conditions: [],
      consultations: [],
      name: null,
      number: null,
      cvv: null,
      vendor: null,
      month: null,
      year: null
    });
  }

  updateMonth(month) {
    this.setState({
      month
    });
  }

  updateYear(year) {
    this.setState({
      year
    });
  }

  toggleError() {
    this.setState({
      error: false
    });
  }

  cancelContact() {
    // Other person hasn't replied yet
    // So just remove it
    this.removeContact();
  }

  addContact() {
    const user = this.props.account._id;
    const contact = this.state.coach;
    const {
      goals,
      conditions,
      consultations,
      name,
      number,
      cvv,
      month,
      year,
      vendor
    } = this.state;

    // Start the loading
    this.setState({ loading: true, error: false });

    // Make the request
    fetch(`${API_PATH}/contact`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        user,
        contact,
        goals,
        conditions,
        consultations,
        name,
        number,
        cvv,
        month,
        year,
        vendor
      })
    })
      .then(response => response.json())
      .then(contact => {
        // If there is no contact returned
        // Or if there is an error with the card
        // TODO: Handle this better
        if (!contact._id) return this.setState({ loading: false, error: true });

        // This will add it to our store & also
        // Signal the API to send the contact to the other person
        // we do it immeditaely thouh
        this.props.addContact(contact);

        // Update the contact state for this modal
        this.setState({
          contactStatus: CONTACT_REQUEST_CONFIRMED,
          loading: false,
          error: false
        });

        // Now add the Realm thread
        this.addRealm(contact._id, CONTACT, 0);

        // Tell the user about the new coach
        Alert.alert(
          "Congratulations",
          "You have a new coach! They will be in touch soon.",
          [
            {
              text: "Okay",
              onPress: () => {
                this.props.closeCallback();

                // Reset the wizard
                this.clearFields();

                // Here we handle the closing of the modal
                // And also given we want to close any modals
                // If this is opened from the user modal
                if (this.props.coachId) {
                  setTimeout(() => {
                    this.props.parentCloseCallback();
                  }, 100);
                }
              }
            }
          ]
        );
      })
      .catch(error => {
        this.setState({ loading: false, error: true });
      });
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

  updateCard(card) {
    const { name, number, cvv, month, year, vendor } = card;

    // If those are null, then no
    if (name + number + cvv == "") return;

    this.setState(
      {
        name,
        number,
        cvv,
        month,
        year,
        vendor,
        card_modal: false
      },
      () => {
        // Finally action everything
        this.addContact();
      }
    );
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.closeCallback();
          this.clearFields();
        }}
      >
        <ErrorComponent visible={this.state.error} action={this.toggleError} />

        <LoadingComponent visible={this.state.loading} />

        <ExpiryModal
          visible={this.state.date_modal}
          closeCallback={() => this.setState({ date_modal: false })}
          updateMonthCallback={this.updateMonth}
          updateYearCallback={this.updateYear}
          year={this.state.year}
          month={this.state.month}
        />

        <CardModal
          visible={this.state.card_modal}
          closeCallback={() => this.setState({ card_modal: false })}
          updateCard={this.updateCard}
        />

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
              <KeyboardAvoidingView
                style={{
                  zIndex: 6,
                  width,
                  height,
                  padding: 0,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  alignContent: "flex-start"
                }}
              >
                <View
                  style={{
                    zIndex: 8,
                    width,
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "flex-start",
                    padding: 20,
                    paddingTop: 40,
                    marginBottom: 40
                  }}
                >
                  <IconComponent
                    size={26}
                    name="x"
                    color={COLORS.DARK.v3}
                    action={() => {
                      // Dismiss the modal
                      this.props.closeCallback();

                      // Reset the wizard
                      this.clearFields();
                    }}
                  />
                </View>

                {this.state.loading && (
                  <Text
                    style={{
                      width,
                      padding: 20,
                      paddingTop: 20,
                      paddingBottom: 10,
                      color: "#25D5A1",
                      fontSize: 12,
                      fontWeight: "800"
                    }}
                  >
                    ADDING CARD...
                  </Text>
                )}

                {this.state.error && (
                  <Text
                    style={{
                      width,
                      padding: 20,
                      paddingTop: 20,
                      paddingBottom: 10,
                      color: "#ED4A70",
                      fontSize: 12,
                      fontWeight: "800"
                    }}
                  >
                    THIS IS NOT A VALID CARD
                  </Text>
                )}

                <Image
                  style={{
                    zIndex: 0,
                    width,
                    height,
                    position: "absolute",
                    top: 0,
                    left: 0
                  }}
                  source={require("../../assets/images/background-white.png")}
                  resizeMode="cover"
                />

                {this.state.current == 0 && (
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <SubheadingComponent
                      title="Before we start!"
                      color={COLORS.DARK.v6}
                      style={{ padding: 20, paddingBottom: 5 }}
                    />

                    <HeadingComponent
                      text="Inform your coach of any of the following pre existing conditions you may have."
                      color={COLORS.DARK.v4}
                      numberOfLines={5}
                      size={16}
                      style={{ textAlign: "center", padding: 20 }}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      {this.conditions.map((condition, index) => {
                        const selected =
                          this.state.conditions.indexOf(condition) != -1;
                        const color = selected ? COLORS.DARK.v3 : "#AAA";

                        return (
                          <ButtonComponent
                            key={index}
                            title={condition}
                            style={{ margin: 2 }}
                            color={color}
                            action={() => {
                              if (selected) {
                                this.setState({
                                  conditions: this.state.conditions.filter(
                                    stateCondition => {
                                      return condition != stateCondition;
                                    }
                                  )
                                });
                              } else {
                                this.setState({
                                  conditions: [
                                    ...this.state.conditions,
                                    condition
                                  ]
                                });
                              }
                            }}
                          />
                        );
                      })}
                    </View>

                    <View
                      style={{
                        marginTop: 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <ButtonComponent
                        title="Next"
                        solid={true}
                        color={COLORS.ACCENT.v1}
                        action={() => this.setState({ current: 1 })}
                      />
                    </View>
                  </View>
                )}

                {this.state.current == 1 && (
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <SubheadingComponent
                      title="Goals"
                      color={COLORS.DARK.v6}
                      style={{ padding: 20, paddingBottom: 5 }}
                    />

                    <HeadingComponent
                      text="What are your goals with getting a coach?"
                      color={COLORS.DARK.v4}
                      numberOfLines={5}
                      size={16}
                      style={{ textAlign: "center", padding: 20 }}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      {this.goals.map((goal, index) => {
                        const selected = this.state.goals.indexOf(goal) != -1;
                        const color = selected ? COLORS.DARK.v3 : "#AAA";

                        return (
                          <ButtonComponent
                            key={index}
                            title={goal}
                            style={{ margin: 2 }}
                            color={color}
                            action={() => {
                              if (selected) {
                                this.setState({
                                  goals: this.state.goals.filter(stateGoal => {
                                    return goal != stateGoal;
                                  })
                                });
                              } else {
                                this.setState({
                                  goals: [...this.state.goals, goal]
                                });
                              }
                            }}
                          />
                        );
                      })}
                    </View>

                    <View
                      style={{
                        marginTop: 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <ButtonComponent
                        title="Previous"
                        solid={true}
                        color={COLORS.ACCENT.v1}
                        action={() => this.setState({ current: 0 })}
                      />
                      <ButtonComponent
                        title="Next"
                        solid={true}
                        color={COLORS.ACCENT.v1}
                        action={() => this.setState({ current: 2 })}
                      />
                    </View>
                  </View>
                )}

                {this.state.current == 2 && (
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center"
                    }}
                  >
                    <SubheadingComponent
                      title="Almost there!"
                      color={COLORS.DARK.v6}
                      style={{ padding: 20, paddingBottom: 5 }}
                    />

                    <HeadingComponent
                      text="Let your coach know what best times are to contact you?"
                      color={COLORS.DARK.v4}
                      numberOfLines={5}
                      size={16}
                      style={{ textAlign: "center", padding: 20 }}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      {this.consultations.map((consultation, index) => {
                        const selected =
                          this.state.consultations.indexOf(consultation) != -1;
                        const color = selected ? COLORS.DARK.v3 : "#AAA";

                        return (
                          <ButtonComponent
                            key={index}
                            title={consultation}
                            style={{ margin: 2 }}
                            color={color}
                            action={() => {
                              if (selected) {
                                this.setState({
                                  consultations: this.state.consultations.filter(
                                    stateConsultation => {
                                      return consultation != stateConsultation;
                                    }
                                  )
                                });
                              } else {
                                this.setState({
                                  consultations: [
                                    ...this.state.consultations,
                                    consultation
                                  ]
                                });
                              }
                            }}
                          />
                        );
                      })}
                    </View>

                    <HeadingComponent
                      text="Don't worry - you get a free week as a trial on us! you can cancel at any time."
                      color={COLORS.DARK.v4}
                      numberOfLines={5}
                      size={16}
                      style={{ textAlign: "center", padding: 20 }}
                    />

                    <View
                      style={{
                        marginTop: 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <ButtonComponent
                        title="Start Now"
                        solid={false}
                        color={COLORS.ACCENT.v1}
                        action={() =>
                          this.setState({
                            card_modal: true,
                            coach: this.props.coachId
                          })
                        }
                      />
                    </View>
                  </View>
                )}
              </KeyboardAvoidingView>
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

export const CoachWizardModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(CoachWizardRC);
