import React from "react";
import { View, Text, Dimensions } from "react-native";

export class ConnectedPartial extends React.Component {
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
          Connecting...
        </Text>
      </View>
    );
  }
}
