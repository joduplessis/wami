import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export class TagComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.selectCallback}
        style={{ width: "100%", paddingBottom: 10, paddingTop: 0 }}
      >
        <Text
          style={{
            color: "#424E5E",
            fontSize: 24,
            fontWeight: this.props.current ? "800" : "600"
          }}
        >
          {this.props.text.toTitleCase()}
        </Text>
      </TouchableOpacity>
    );
  }
}
