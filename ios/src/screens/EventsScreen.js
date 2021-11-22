import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  Linking,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import {
  MenuEventComponent,
  HeadingComponent,
  SubheadingComponent
} from "../components";
import { EventModal } from "../modals";
import { GQL, COLORS } from "../helpers";
import { loading, error } from "../actions";

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event_modal: false,
      event: null,
      filter: ""
    };

    this.fetchEvent = this.fetchEvent.bind(this);
  }

  componentDidMount() {
    // this.fetchEvent("5bdb18a63320c7cf822c1e16");
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

  render() {
    const { width, height } = Dimensions.get("screen");
    let upcomingAppointmentCount = 0;

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <EventModal
          visible={this.state.event_modal}
          event={this.state.event}
          closeCallback={() =>
            this.setState({ event_modal: false, event: null })
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
            source={require("../../assets/images/headers/02.png")}
            resizeMode="contain"
          />

          <HeadingComponent
            text="Upcoming Appointments"
            color={COLORS.DARK.v6}
            style={{ paddingBottom: 10, paddingLeft: 20, paddingTop: 60 }}
          />

          <SubheadingComponent
            title="Below is a list of appointments coaches have made with you."
            color={COLORS.DARK.v2}
            style={{ paddingBottom: 30, paddingLeft: 20, paddingTop: 10 }}
          />

          <View
            style={{
              padding: 20,
              paddingBottom: 0,
              paddingTop: 0,
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            {this.props.events.map((event, index) => {
              const re = new RegExp(this.state.filter + ".*");

              if (!event.notes.match(re) || event.processed) return;

              const isExpert = this.props.account._id == event.expert._id;
              const expertConfirmed = event.attendees
                .filter(attendee => {
                  return (
                    attendee.user._id == event.expert._id &&
                    attendee.status == "CONFIRMED"
                  );
                })
                .flatten();

              // If all people are confirmed
              const allAttendeesConfirmed = event.attendees.every(attendee => {
                return attendee.status == "CONFIRMED";
              });

              upcomingAppointmentCount++;

              return (
                <MenuEventComponent
                  key={index}
                  allAttendeesConfirmed={allAttendeesConfirmed}
                  expertConfirmed={expertConfirmed}
                  isExpert={isExpert}
                  processed={false}
                  title={event.notes}
                  name={isExpert ? event.owner.name : event.expert.name}
                  image={isExpert ? event.owner.image : event.expert.image}
                  expert={event.expert}
                  color={event.expert.color}
                  time={event.start}
                  action={() => this.fetchEvent(event._id)}
                  style={{ marginBottom: 10, width: width - 40 }}
                />
              );
            })}
          </View>

          {upcomingAppointmentCount == 0 && (
            <SubheadingComponent
              title="You have no appointments yet."
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
  updateError: payload => {
    dispatch(error(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  }
});

export const EventsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);
