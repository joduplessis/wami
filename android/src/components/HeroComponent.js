import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { FONT } from "../helpers";

export const HeroComponent = ({ image, title, subtitle, action, height }) => {
  const { width } = Dimensions.get("screen");
  const heroHeight = height;
  const heroWidth = width - 40;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={action}
        style={{
          height: heroHeight,
          width: heroWidth,
          margin: 20,
          marginBottom: 0,
          marginTop: 0,
          padding: 20,
          borderRadius: 20,
          backgroundColor: "#9DD6EB",
          overflow: "hidden",
          borderRadius: 20
        }}
      >
        <Image
          style={{
            zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            height: heroHeight,
            width: heroWidth
          }}
          source={image}
          resizeMode="cover"
        />

        <Image
          source={require("../../assets/images/background-gradient-shadow.png")}
          style={{
            zIndex: 2,
            position: "absolute",
            top: 0,
            left: 0,
            height: heroHeight,
            width: heroWidth
          }}
          resizeMode="cover"
        />

        <View
          style={{
            padding: 20,
            zIndex: 3,
            position: "absolute",
            top: 0,
            left: 0,
            width: heroWidth,
            height: heroHeight,
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            alignContent: "center"
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              fontFamily: FONT,
              fontSize: 50,
              color: "white",
              zIndex: 2
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontWeight: "500",
              fontFamily: FONT,
              fontSize: 18,
              color: "white",
              marginTop: 5,
              zIndex: 2
            }}
          >
            {subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
