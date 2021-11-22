import React from "react";
import { View, Text } from "react-native";
import { COLORS, FONT } from "../helpers";

export const LabelComponent = ({ color, text }) => {
  return (
    <Text
      style={{
        fontSize: 12,
        color: color ? color : COLORS.DARK.v3,
        fontFamily: FONT,
        fontWeight: "500"
      }}
    >
      {text}
    </Text>
  );
};
