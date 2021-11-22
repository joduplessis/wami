import React from "react";
import { View, Dimensions } from "react-native";
import { BarIndicator } from "react-native-indicators";

export class LoadingComponent extends React.Component {
  render() {
    const { width, height } = Dimensions.get("screen");

    if (!this.props.visible) {
      return null;
    }

    return (
      <View
        style={{
          zIndex: 90000,
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
