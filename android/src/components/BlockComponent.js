import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { S3_PATH, COLORS, FONT } from "../helpers";
import { IconComponent } from "./IconComponent";

export const BlockComponent = ({
  action,
  color,
  image,
  title,
  subtitle,
  style,
  icon
}) => {
  const height = 180;
  const width = Dimensions.get("screen").width / 2 - 40;

  return (
    <TouchableOpacity
      onPress={action}
      style={{
        ...style,
        overflow: "hidden",
        backgroundColor: color,
        marginLeft: 20,
        padding: 20,
        borderRadius: 20,
        height,
        width,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        alignContent: "center"
      }}
    >
      {icon && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            alignContent: "flex-end",
            flex: 1
          }}
        >
          <IconComponent size={26} name={icon} color="white" />
        </View>
      )}

      {image && (
        <Image
          style={{
            zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            height,
            width
          }}
          source={{ uri: `${S3_PATH}${image}` }}
          resizeMode="cover"
        />
      )}

      {image && (
        <Image
          source={require("../../assets/images/background-gradient-shadow.png")}
          style={{
            zIndex: 2,
            position: "absolute",
            top: 0,
            left: 0,
            height,
            width
          }}
          resizeMode="cover"
        />
      )}

      {!image && (
        <Image
          source={require("../../assets/images/background-white-watercolour.png")}
          style={{
            zIndex: 2,
            position: "absolute",
            top: 0,
            left: 0,
            height,
            width,
            tintColor: "white",
            opacity: 0.1
          }}
          resizeMode="cover"
        />
      )}

      <Text
        style={{
          fontWeight: "700",
          fontFamily: FONT,
          fontSize: 18,
          color: "white",
          zIndex: 2
        }}
      >
        {title}
      </Text>

      <Text
        numberOfLines={2}
        ellipsisMode="tail"
        style={{
          fontWeight: "700",
          fontFamily: FONT,
          fontSize: 13,
          color: "white",
          marginTop: 5,
          zIndex: 2
        }}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};
