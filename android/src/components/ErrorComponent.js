import React from "react";
import { Dimensions, View, Text, TouchableOpacity } from "react-native";

export class ErrorComponent extends React.Component {
  render() {
    const { width, height } = Dimensions.get("screen");

    if (!this.props.visible) {
      return null;
    }

    console.log(this.props.visible);

    return (
      <TouchableOpacity
        onPress={vars => this.props.action(vars)}
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
