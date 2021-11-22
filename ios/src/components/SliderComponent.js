import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";

export class Slider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { width } = Dimensions.get("screen");

    return (
      <View style={{ width }}>
        <ScrollView
          contentContainerStyle={{ paddingRight: 20 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.props.children}
        </ScrollView>
      </View>
    );
  }
}

export const SliderComponent = Slider;
