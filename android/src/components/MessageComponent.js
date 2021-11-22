import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { AvatarComponent } from "./AvatarComponent";
import { COLORS, FONT } from "../helpers";
import { connect } from "react-redux";

export class MessageComponentRC extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const name = this.props.channel
      ? this.props.name.replace("_", "")
      : this.props.name;
    const opacity = this.props.unread > 0 ? 1 : 0.5;

    return (
      <View
        style={{
          borderTopWidth: 0,
          borderColor: "#eef2f5",
          marginBottom: 0,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <TouchableOpacity onPress={this.props.avatarAction}>
          <AvatarComponent
            title={this.props.name}
            image={this.props.image}
            borderColor={this.props.color}
            border={false}
            size="small"
            padding={true}
            square={this.props.square}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.props.action}
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            alignContent: "center"
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            {name && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  paddingRight: 5,
                  opacity,
                  flex: 1
                }}
              >
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    fontSize: 18,
                    color: COLORS.DARK.v3,
                    fontWeight: "500",
                    fontFamily: FONT,
                    flex: 1
                  }}
                >
                  {name}
                </Text>
              </View>
            )}

            {this.props.title && (
              <View
                style={{
                  maxWidth: 70,
                  backgroundColor: COLORS.LIGHT.v1,
                  borderRadius: 10,
                  padding: 5,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    fontSize: 10,
                    color: COLORS.LIGHT.v5,
                    fontWeight: "800",
                    fontFamily: FONT
                  }}
                >
                  {this.props.title.toUpperCase()}
                </Text>
              </View>
            )}

            {this.props.private != undefined && (
              <View style={{ paddingLeft: 10 }}>
                <Icon
                  name={this.props.private ? "eye-off" : "eye"}
                  size={15}
                  color={COLORS.DARK.v3}
                />
              </View>
            )}
          </View>

          {this.props.last && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                paddingRight: 5,
                opacity
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.DARK.v3,
                  fontWeight: "600",
                  fontFamily: FONT
                }}
              >
                {this.props.last.length > 40
                  ? `${this.props.last.substring(0, 40)}`
                  : this.props.last}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {this.props.unread > 0 && (
          <View
            style={{
              marginLeft: 10,
              backgroundColor: this.props.color,
              padding: 10,
              paddingTop: 5,
              paddingBottom: 5,
              borderRadius: 15,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "white",
                fontWeight: "700",
                fontFamily: FONT
              }}
            >
              {this.props.unread}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const MessageComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageComponentRC);
