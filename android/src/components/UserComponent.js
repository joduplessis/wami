import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { S3_PATH, COLORS, FONT } from "../helpers";

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = 100;
    const height = 190;

    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={{
          width,
          height,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          ...this.props.style
        }}
      >
        <View
          style={{
            borderWidth: 7,
            borderColor: "#eef2f5",
            width: 100,
            height: 100,
            backgroundColor: this.props.color,
            borderRadius: 50,
            padding: 8
          }}
        >
          <Image
            style={{
              zIndex: 1,
              position: "relative",
              width: 70,
              height: 70,
              borderRadius: 35
            }}
            source={{ uri: `${S3_PATH}${this.props.image}` }}
          />
        </View>

        <Text
          numberOfLines={2}
          style={{
            color: COLORS.DARK.v4,
            fontSize: 18,
            fontFamily: FONT,
            fontWeight: "500",
            zIndex: 3,
            marginTop: 5,
            textAlign: "center"
          }}
        >
          {this.props.name}
        </Text>

        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            color: COLORS.DARK.v0,
            fontSize: 12,
            paddingTop: 5,
            fontFamily: FONT,
            fontWeight: "800",
            textAlign: "center"
          }}
        >
          {this.props.title.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
}

export const UserComponent = User;
