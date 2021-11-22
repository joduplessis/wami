import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { FONT } from "../helpers";

export class ButtonComponent extends React.Component {
  constructor(props) {
    super(props);

    this.callback = this.callback.bind(this);
  }

  callback(data) {
    this.props.action(data);
  }

  render() {
    const color = this.props.color ? this.props.color : "black";
    const backgroundColor = this.props.backgroundColor
      ? this.props.backgroundColor
      : "white";
    const fontSize = this.props.size == "small" ? 10 : 13;
    const padding = this.props.size == "small" ? 10 : 13;
    const borderRadius = this.props.size == "small" ? 20 : 30;
    const borderWidth = this.props.solid ? 0 : 2;

    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={{
          borderWidth,
          borderColor: color,
          backgroundColor,
          padding,
          borderRadius,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          ...this.props.style
        }}
      >
        {this.props.title && (
          <Text
            style={{
              fontFamily: FONT,
              fontWeight: "800",
              fontSize,
              color: color
            }}
          >
            {this.props.title.toUpperCase()}
          </Text>
        )}
        {this.props.icon && (
          <Icon
            name={this.props.icon}
            size={20}
            color={color}
            style={{ marginLeft: 10 }}
          />
        )}
      </TouchableOpacity>
    );
  }
}
