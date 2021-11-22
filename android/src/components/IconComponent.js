import React from "react";
import Icon from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";

export const IconComponent = ({ action, name, size, color, style }) => {
  return (
    <TouchableOpacity onPress={action}>
      <Icon
        name={name}
        size={size}
        color={color ? color : "#212934"}
        style={style}
      />
    </TouchableOpacity>
  );
};
