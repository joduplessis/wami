import React from "react";
import { View, Text, Image } from "react-native";
import { S3_PATH } from "../helpers";

export class AvatarComponent extends React.Component {
  calculateStatusColor() {
    switch (this.props.status) {
      case "ONLINE":
        return "#51E297";
      case "AWAY":
        return "orange";
      default:
        return "transparent";
    }
  }

  calculateDimensions() {
    const size = this.props.size ? this.props.size : "small";
    const ratio = this.props.square ? 3 : 2;

    switch (size) {
      case "x-small":
        return { width: 30, height: 30, borderRadius: 30 / ratio };
      case "small":
        return { width: 40, height: 40, borderRadius: 40 / ratio };
      case "medium":
        return { width: 54, height: 54, borderRadius: 54 / ratio };
      case "large":
        return { width: 80, height: 80, borderRadius: 80 / ratio };
      case "x-large":
        return { width: 100, height: 100, borderRadius: 100 / ratio };
      case "xx-large":
        return { width: 120, height: 120, borderRadius: 120 / ratio };
      case "xxx-large":
        return { width: 150, height: 150, borderRadius: 150 / ratio };
      default:
        return { width: 40, height: 40, borderRadius: 40 / ratio };
    }
  }

  render() {
    const { borderRadius, width, height } = this.calculateDimensions();

    const borderColor = this.props.borderColor
      ? this.props.borderColor
      : "transparent";
    const borderWidth = 0;
    const innerBorderRadius = borderRadius - (this.props.padding ? 4 : 2);
    const left = this.props.padding ? 2 : 0;
    const top = this.props.padding ? 2 : 0;
    const title = this.props.title
      ? this.props.title
          .split(" ")
          .map((part, _) => {
            return part[0] ? part[0].toUpperCase() : "";
          })
          .splice(0, 2)
          .toString()
          .replace(",", "")
          .trim()
      : "Y";

    return (
      <View
        style={{
          width,
          height,
          borderColor,
          borderWidth,
          borderRadius,
          ...this.props.style
        }}
      >
        <View
          style={{
            backgroundColor: borderColor,
            zIndex: 1,
            position: "relative",
            top,
            left,
            width,
            height,
            borderRadius: innerBorderRadius
          }}
        >
          {this.props.image && (
            <Image
              style={{
                zIndex: 1,
                position: "relative",
                top: 0,
                left: 0,
                width,
                height,
                borderRadius: innerBorderRadius
              }}
              source={{ uri: `${S3_PATH}${this.props.image}` }}
              resizeMode="cover"
            />
          )}

          {!this.props.image && (
            <View
              style={{
                width,
                height,
                borderRadius: innerBorderRadius,
                backgroundColor: "rgba(255,255,255,0.75)",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <Text
                style={{
                  left: 1,
                  top: 1,
                  fontSize: width / 2.5,
                  color: this.props.initialsColor
                    ? this.props.initialsColor
                    : borderColor,
                  fontWeight: "800"
                }}
              >
                {title}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
