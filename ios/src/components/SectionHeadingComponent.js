import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export class SectionHeadingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.callback = this.callback.bind(this);
  }

  callback(data) {
    this.props.action(data);
  }

  render() {
    const { title } = this.props;
    const { width, height } = Dimensions.get("screen");
    const color = this.props.color ? this.props.color : "#C5C5D2";
    const icon = this.props.icon ? this.props.icon : "chevron-right";
    const moreText = this.props.moreText
      ? this.props.moreText.toUpperCase()
      : "MORE";
    const backgroundColor = this.props.backgroundColor
      ? this.props.backgroundColor
      : "#1F2D3D";

    return (
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          justifyContent: "flex-start",
          alignItems: "center",
          alignContent: "center",
          ...this.props.style
        }}
      >
        <Text
          textSpacing={1}
          style={{ color: "#ADB5BD", fontSize: 12, fontWeight: "800" }}
        >
          {title.toUpperCase()}
        </Text>

        {this.props.info && (
          <Text
            style={{
              paddingLeft: 10,
              color,
              fontSize: 12,
              fontWeight: "800",
              paddingRight: 5
            }}
          >
            {this.props.info.toUpperCase()}
          </Text>
        )}

        <View style={{ flex: 1 }} />

        {this.props.more && (
          <TouchableOpacity
            onPress={this.callback}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <Text
              style={{
                color: "#CFD4DA",
                fontSize: 13,
                fontWeight: "800",
                paddingRight: 5
              }}
            >
              {moreText}
            </Text>

            <Icon name={icon} size={17} color="#CFD4DA" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
