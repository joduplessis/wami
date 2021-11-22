import React from "react";
import { TouchableOpacity, View, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export class TextButtonComponent extends React.Component {
  constructor(props) {
    super(props);

    this.callback = this.callback.bind(this);
  }

  callback(data) {
    this.props.action(data);
  }

  render() {
    const color = this.props.color ? this.props.color : "#2CD1C0";

    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={{
          paddingTop: 20,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          alignContent: "center",
          ...this.props.style
        }}
      >
        <Icon name={this.props.icon} size={20} color={color} />
        <Text
          style={{ paddingLeft: 5, color, fontSize: 22, fontWeight: "500" }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
