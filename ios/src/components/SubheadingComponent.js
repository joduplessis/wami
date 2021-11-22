import React from "react";
import { View, Text } from "react-native";
import { FONT } from "../helpers";

export const SubheadingComponent = ({ title, color, style }) => {
  return (
    <Text
      style={{
        fontWeight: "700",
        fontFamily: FONT,
        fontSize: 18,
        color: color ? color : "#212934",
        zIndex: 2,
        ...style
      }}
    >
      {title}
    </Text>
  );
};
