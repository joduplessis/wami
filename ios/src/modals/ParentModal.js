import React from "react";
import { View, Dimensions, Animated, Easing } from "react-native";
import { COLORS } from "../helpers/Constants";
import { SubheadingComponent, IconComponent } from "../components";

export class ParentModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      fadeAnim: new Animated.Value(0),
      slideAnim: new Animated.Value(this.props.height * -1)
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        this.setState({ visible: true });
        Animated.timing(this.state.fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad)
        }).start();
        Animated.timing(this.state.slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad)
        }).start();
      }

      if (!this.props.visible) {
        setTimeout(() => {
          this.setState({ visible: false });
        }, 500);
        Animated.timing(this.state.fadeAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.quad)
        }).start();
        Animated.timing(this.state.slideAnim, {
          toValue: this.props.height * -1,
          duration: 500,
          easing: Easing.in(Easing.quad)
        }).start();
      }
    }
  }

  render() {
    const width = this.props.width
      ? this.props.width
      : Dimensions.get("screen").width;
    const height = Dimensions.get("screen").height;

    if (this.state.visible) {
      return (
        <View
          style={{
            zIndex: 10000,
            position: "absolute",
            bottom: 0,
            left: 0,
            height,
            width
          }}
        >
          <Animated.View
            style={{
              opacity: this.state.fadeAnim,
              zIndex: 2,
              position: "absolute",
              bottom: 0,
              left: 0,
              height,
              width,
              backgroundColor: "rgba(0, 0, 0, 0.25)"
            }}
          />

          <Animated.View
            style={{
              zIndex: 3,
              backgroundColor: "white",
              width,
              height: this.props.height,
              position: "absolute",
              bottom: this.state.slideAnim,
              left: 0,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                width,
                padding: 20,
                borderBottomWidth: 2,
                borderColor: "#eef2f5",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "space-between"
              }}
            >
              <SubheadingComponent
                title={this.props.title}
                color={COLORS.DARK.v6}
              />

              <View style={{ flex: 1 }} />

              {this.props.confirmCallback && (
                <IconComponent
                  name="check"
                  size={24}
                  color={COLORS.DARK.v6}
                  action={this.props.confirmCallback}
                />
              )}

              <IconComponent
                name="x"
                size={24}
                color={COLORS.DARK.v6}
                action={this.props.closeCallback}
                style={{ marginLeft: 10 }}
              />
            </View>

            {this.props.children}
          </Animated.View>
        </View>
      );
    }

    return null;
  }
}
