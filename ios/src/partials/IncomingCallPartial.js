import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Modal,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { AvatarComponent } from "../components/AvatarComponent";
import { connect } from "react-redux";
import { eventOpen, eventIncoming } from "../actions";

export class IncomingCallPartialRC extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.incoming_call_partial) return null;

    const { width, height } = Dimensions.get("screen");

    return (
      <View
        style={{
          zIndex: 1001,
          position: "absolute",
          top: 0,
          left: 0,
          flex: 1,
          backgroundColor: "#2CD1C0",
          width,
          height,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <Text
          style={{ zIndex: 3, color: "white", fontSize: 35, fontWeight: "400" }}
        >
          Incoming ...
        </Text>

        <AvatarComponent
          pulse="white"
          border="white"
          title={this.props.incomingCall.name}
          image={this.props.incomingCall.image}
          size="xxx-large"
          style={{ marginTop: 30 }}
        />

        <View
          style={{
            paddingTop: 20,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.callAccept()}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: 30,
              padding: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              marginRight: 10
            }}
          >
            <Icon name="check" size={45} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.callDecline()}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: 30,
              padding: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <Icon name="x" size={45} color="white" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            paddingTop: 30,
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              zIndex: 3,
              fontSize: 20,
              color: "rgba(255, 255, 255, 0.75)",
              fontWeight: "400"
            }}
          >
            {this.props.incomingCall.title}
          </Text>

          <Text
            style={{
              zIndex: 3,
              color: "white",
              fontSize: 35,
              fontWeight: "400"
            }}
          >
            {this.props.incomingCall.name}
          </Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  eventOpen: () => {
    dispatch(eventIncoming(false));
    dispatch(eventOpen(true));
  },

  eventIncomingDecline: () => {
    dispatch(eventIncoming(false));
  }
});

export const IncomingCallPartial = connect(
  mapStateToProps,
  mapDispatchToProps
)(IncomingCallPartialRC);
