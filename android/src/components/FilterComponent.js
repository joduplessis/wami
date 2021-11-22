import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { FONT } from "../helpers";

export class FilterComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const placeholder = this.props.placeholder
      ? this.props.placeholder
      : "Filter Contacts";
    const color = this.props.color ? this.props.color : "#C5C5D2";
    const placeholderColor = this.props.placeholderColor
      ? this.props.placeholderColor
      : "#C5C5D2";

    return (
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          ...this.props.style
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: "white",
            margin: 10,
            padding: 10,
            borderRadius: 15,
            ...this.props.innerStyle
          }}
        >
          <TextInput
            value={this.props.text}
            autoFocus={this.props.autoFocus ? this.props.autoFocus : false}
            onChangeText={text => this.props.action(text)}
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
            style={{
              flex: 1,
              color,
              fontSize: 16,
              fontFamily: FONT,
              fontWeight: "600"
            }}
          />

          {this.props.text != "" && (
            <TouchableOpacity onPress={() => this.props.action("")}>
              <Icon name="x" size={20} color={color} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
