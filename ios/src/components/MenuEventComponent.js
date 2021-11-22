import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { AvatarComponent } from "./AvatarComponent";
import { COLORS, FONT } from "../helpers";
import { connect } from "react-redux";

const moment = require("moment-timezone");

export class MenuEventComponentRC extends React.Component {
  constructor(props) {
    super(props);

    this.callback = this.callback.bind(this);
  }

  callback(data) {
    this.props.action(data);
  }

  render() {
    const today = moment(new Date());
    const date = moment(this.props.time).tz(this.props.account.timezone);
    const isEventToday = date.isSame(today, "d");
    const time = isEventToday ? date.format("h:mm a") : date.format("MMM Do");
    const backgroundColor = this.props.expertConfirmed
      ? this.props.color
      : "#eef2f5";
    const color = this.props.expertConfirmed ? "white" : "#1F2D3D";

    return (
      <TouchableOpacity
        onPress={this.callback}
        style={{
          padding: 15,
          height: 130,
          borderWidth: 0,
          borderColor: color,
          backgroundColor,
          borderRadius: 15,
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          alignContent: "flex-end",
          ...this.props.style
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            alignContent: "flex-start"
          }}
        >
          <AvatarComponent
            title={this.props.name}
            image={this.props.image}
            borderColor={null}
            initialsColor={this.props.expert.color}
            size="medium"
            padding={true}
            style={{ marginRight: 10 }}
          />

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              alignContent: "flex-start"
            }}
          >
            <View
              style={{
                paddingBottom: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  flex: 1,
                  fontSize: 20,
                  color,
                  fontWeight: "600",
                  fontFamily: FONT
                }}
              >
                {this.props.title}
              </Text>
              {this.props.processed && (
                <Icon
                  name="check-circle"
                  size={18}
                  color={color}
                  style={{ marginLeft: 5 }}
                />
              )}
            </View>

            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                opacity: 0.75,
                paddingBottom: 5,
                fontSize: 10,
                color,
                fontWeight: "700",
                fontFamily: FONT
              }}
            >
              WITH {this.props.name.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 12,
                color,
                opacity: 0.65,
                fontWeight: "700",
                paddingRight: 5,
                fontFamily: FONT
              }}
            >
              {this.props.processed
                ? "COMPLETED"
                : this.props.isExpert
                ? this.props.expertConfirmed
                  ? this.props.allAttendeesConfirmed
                    ? "CONFIRMED"
                    : "WAITING"
                  : "PLEASE CONFIRM"
                : this.props.expertConfirmed
                ? "EXPERT CONFIRMED"
                : "EXPERT UNCONFIRMED"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <Icon
              name="calendar"
              size={14}
              color={color}
              style={{ opacity: 0.8 }}
            />

            <Text
              style={{
                paddingLeft: 5,
                fontSize: 12,
                color,
                opacity: 0.8,
                fontWeight: "500",
                fontFamily: FONT
              }}
            >
              {time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const MenuEventComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuEventComponentRC);
