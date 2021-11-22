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
import { connect } from "react-redux";
import { eventOpen, eventRating } from "../actions";
import { RTCView } from "react-native-webrtc";

export class CallPartialRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 0
    };

    this.formatSeconds = this.formatSeconds.bind(this);
  }

  pad(n) {
    return n < 10 ? "0" + n : n;
  }

  formatSeconds(secs) {
    var h = Math.floor(secs / 3600);
    var m = Math.floor(secs / 60) - h * 60;
    var s = Math.floor(secs - h * 3600 - m * 60);

    return this.pad(h) + ":" + this.pad(m) + ":" + this.pad(s);
  }

  componentDidMount() {
    this.setState({
      duration: 0
    });

    setInterval(() => {
      this.setState({
        duration: this.state.duration + 1
      });
    }, 1000);
  }

  render() {
    if (!this.props.call_partial) return null;

    const { width, height } = Dimensions.get("screen");

    return (
      <View
        style={{
          zIndex: 1000,
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "white",
          width,
          height,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <RTCView
          streamURL={this.props.remoteViewSrc}
          objectFit="cover"
          zOrder={1}
          style={{
            width,
            height,
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#2CD1C0",
            zIndex: 999
          }}
        />

        <RTCView
          streamURL={this.props.selfViewSrc}
          objectFit="cover"
          zOrder={0}
          style={{
            zIndex: 1000,
            height: 150,
            width: 150,
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "#2CD1C0"
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width,
            height,
            zIndex: 1001
          }}
        >
          <View style={{ flex: 1 }} />

          <View
            style={{
              padding: 20,
              flexDirection: "column",
              alignItems: "flex-start",
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

          <View
            style={{
              padding: 20,
              paddingTop: 0,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.callEnd()}
              style={{
                height: 50,
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                borderRadius: 30,
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                marginRight: 5
              }}
            >
              <Icon name="x" size={18} color="#424E5E" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.switchVideoType()}
              style={{
                height: 50,
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                borderRadius: 30,
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                marginRight: 5
              }}
            >
              <Icon name="repeat" size={18} color="#424E5E" />
            </TouchableOpacity>

            <View
              style={{
                height: 50,
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                borderRadius: 30,
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <Icon name="clock" size={18} color="#424E5E" />
              <Text
                style={{
                  paddingLeft: 10,
                  fontSize: 18,
                  color: "#424E5E",
                  fontWeight: "500"
                }}
              >
                {this.formatSeconds(this.state.duration)}
              </Text>
            </View>

            <View style={{ flex: 1 }} />
          </View>
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
  eventClose: () => {
    dispatch(eventOpen(false));
    dispatch(eventRating(true));
  }
});

export const CallPartial = connect(
  mapStateToProps,
  mapDispatchToProps
)(CallPartialRC);
