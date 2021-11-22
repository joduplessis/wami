import React, { Component } from "react";
import { Text } from "react-native";
import { FONT } from "../helpers";

export const HeadingComponent = ({
  text,
  color,
  size,
  numberOfLines,
  style
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsisStyle="tail"
      style={{
        fontWeight: "400",
        fontFamily: FONT,
        fontSize: size ? size : 35,
        color: color ? color : "#212934",
        zIndex: 2,
        ...style
      }}
    >
      {text}
    </Text>
  );
};
