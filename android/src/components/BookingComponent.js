import React from "react";
import { TouchableOpacity, Text } from "react-native";

export class BookingComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const color = this.props.selected ? "#424E5E" : "#888891";
    const backgroundColor = this.props.selected ? "#eef2f5" : "white";
    const borderColor = this.props.selected ? this.props.color : "#eef2f5";

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.bookingCallback(this.props.time);
        }}
        style={{
          marginRight: 2,
          marginBottom: 2,
          borderWidth: 2,
          borderColor,
          backgroundColor,
          padding: 8,
          borderRadius: 10,
          ...this.props.style
        }}
      >
        <Text style={{ color, fontSize: 14, fontWeight: "800" }}>
          {this.props.displayTime}
        </Text>
      </TouchableOpacity>
    );
  }
}
