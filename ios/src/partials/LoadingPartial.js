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
import { connect } from "react-redux";
import { BarIndicator } from "react-native-indicators";

class LoadingPartialRC extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    if (!this.props.visible) {
      return null;
    }

    return (
      <View
        style={{
          height,
          width,
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <BarIndicator size={20} color="white" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const LoadingPartial = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingPartialRC);
