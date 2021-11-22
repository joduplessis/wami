import React from "react";
import {
  View,
  Dimensions,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { FONT } from "../helpers";

export class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      slideAnim: new Animated.Value(-200)
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        this.setState({ visible: true });
        Animated.timing(this.state.slideAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.quad)
        }).start();
      }

      if (!this.props.visible) {
        const topLocaton = this.props.updateDescriptionCallback ? -150 : -100;
        setTimeout(() => {
          this.setState({ visible: false });
        }, 200);
        Animated.timing(this.state.slideAnim, {
          toValue: topLocaton,
          duration: 200,
          easing: Easing.in(Easing.quad)
        }).start();
      }
    }
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    if (this.state.visible) {
      return (
        <Animated.View
          style={{
            zIndex: 3,
            backgroundColor: "white",
            height: this.props.updateDescriptionCallback ? 150 : 100,
            width,
            position: "absolute",
            top: this.state.slideAnim,
            left: 0,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: this.props.color,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            <View style={{ flex: 1 }}>
              <TextInput
                placeholder={this.props.placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                autoFocus={true}
                value={this.props.text}
                onChangeText={text => this.props.updateCallback(text)}
                style={{
                  flex: 1,
                  paddingLeft: 10,
                  fontSize: 17,
                  color: "white",
                  fontFamily: FONT,
                  fontWeight: "800"
                }}
              />

              {this.props.updateDescriptionCallback && (
                <TextInput
                  placeholder="Description"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={this.props.description}
                  onChangeText={text =>
                    this.props.updateDescriptionCallback(text)
                  }
                  style={{
                    flex: 1,
                    paddingLeft: 10,
                    fontSize: 13,
                    color: "white",
                    fontFamily: FONT,
                    fontWeight: "800"
                  }}
                />
              )}
            </View>

            <TouchableOpacity
              style={{
                paddingRight: 20,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
              onPress={() => this.props.confirmCallback()}
            >
              <Icon name="check" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
              onPress={() => this.props.closeCallback()}
            >
              <Icon name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    return null;
  }
}
