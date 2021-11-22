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
import { error } from "../actions";

class ErrorPartialRC extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    if (!this.props.visible) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.updateError(false)}
        style={{
          backgroundColor: "#ED4A70",
          padding: 0,
          zIndex: 100000,
          position: "absolute",
          bottom: 0,
          left: 0,
          width,
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center"
        }}
      >
        <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
          There has been an error
        </Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  updateError: text => {
    dispatch(error(text));
  }
});

export const ErrorPartial = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorPartialRC);
