import React from "react";
import { TouchableOpacity } from "react-native";

export class ColorComponent extends React.Component {
  constructor(props) {
    super(props);

    this.selectCallback = this.selectCallback.bind(this);
  }

  selectCallback(data) {
    this.props.selectCallback(data);
  }

  render() {
    const borderColor =
      this.props.selected == this.props.color ? "#DDD" : "white";

    return (
      <TouchableOpacity
        style={{
          borderColor,
          borderWidth: 3,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: this.props.color,
          margin: 15
        }}
        onPress={() => this.selectCallback(this.props.color)}
      />
    );
  }
}
