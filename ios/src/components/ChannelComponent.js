import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { S3_PATH, FONT } from "../helpers";

export class ChannelComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const backgroundColor = this.props.user
      ? this.props.user.color
      : this.props.group
      ? this.props.group.color
      : "#eef2f5";
    const image = this.props.user
      ? this.props.user.image
      : this.props.group
      ? this.props.group.image
      : null;
    const width = this.props.width
      ? this.props.width
      : Dimensions.get("screen").width - 100;
    const height = this.props.height ? this.props.height : 200;
    const owner = this.props.group
      ? this.props.group.name
      : this.props.user.name;

    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={{
          width,
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          alignContent: "center",
          height,
          padding: 20,
          ...this.props.style
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            backgroundColor,
            borderRadius: 20
          }}
        >
          <Image
            style={{ borderRadius: 20, width, height, zIndex: 1 }}
            source={{ uri: `${S3_PATH}${this.props.image}` }}
          />
        </View>

        <Text
          numberOfLines={2}
          style={{
            paddingBottom: 5,
            color: "white",
            fontSize: 30,
            fontFamily: FONT,
            fontWeight: "700",
            zIndex: 3
          }}
        >
          {this.props.name}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <Image
            style={{ borderRadius: 15, width: 30, height: 30, zIndex: 1 }}
            source={{ uri: `${S3_PATH}${image}` }}
          />

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              alignContent: "center"
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                opacity: 0.85,
                flex: 1,
                paddingLeft: 5,
                color: "white",
                fontSize: 12,
                fontFamily: FONT,
                fontWeight: "600",
                zIndex: 3
              }}
            >
              {this.props.members == 1
                ? "1 MEMBER"
                : `${this.props.members} MEMBERS`}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                paddingLeft: 5,
                color: "white",
                fontSize: 13,
                fontFamily: FONT,
                fontWeight: "700",
                zIndex: 3
              }}
            >
              {owner.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
