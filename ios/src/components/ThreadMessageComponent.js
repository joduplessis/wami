import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  Modal
} from "react-native";
import { AvatarComponent, ButtonComponent } from "../components";
import { hexToRgb, S3_PATH, COLORS, FONT } from "../helpers";
import Icon from "react-native-vector-icons/Feather";
import Ionicon from "react-native-vector-icons/Ionicons";

export class ThreadMessageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      reaction: false,
      reactions: [
        "😄",
        "👍🏻",
        "👌🏻",
        "😂",
        "🙈",
        "😜",
        "⭐️",
        "👏🏻",
        "👎🏻",
        "😴",
        "😦",
        "😱"
      ]
    };
  }

  render() {
    const color = this.props.owner ? COLORS.DARK.v5 : COLORS.DARK.v3;
    const paddingBottom = this.props.hasNext ? 1 : 15;
    const paddingTop = this.props.hasPrevious ? 1 : 15;
    const { width, height } = Dimensions.get("screen");
    const { r, g, b } = this.props.ownerColor
      ? hexToRgb(this.props.ownerColor.replace("#", ""))
      : { r: 1, g: 1, b: 1 };
    const backgroundColor = this.props.owner
      ? COLORS.LIGHT.v3
      : COLORS.LIGHT.v1;
    const hasImage =
      this.props.mime == "image/jpg" ||
      this.props.mime == "image/jpeg" ||
      this.props.mime == "image/png";

    return (
      <View
        style={{
          borderColor: "#EFEFEF",
          borderBottomWidth: 0,
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          alignContent: "flex-start"
        }}
      >
        {this.state.reaction && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.reaction}
            onRequestClose={() => this.setState({ reaction: false })}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 20,
                  width: width - 50,
                  padding: 0,
                  height: height - 350,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  {this.state.reactions.map((emoticon, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.addMessageReaction(
                            this.props.id,
                            `${emoticon}:${this.props.uname}:${this.props.uid}`
                          );
                          this.setState({ reaction: false });
                        }}
                        key={index}
                        style={{ padding: 10, margin: 2 }}
                      >
                        <Text style={{ fontSize: 45 }}>{emoticon}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingTop: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                  onPress={() => this.setState({ reaction: false })}
                >
                  <Icon name="x" size={40} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        <AvatarComponent
          size="small"
          title={this.props.name}
          borderColor={this.props.color}
          border={false}
          initialsColor={this.props.color}
          image={this.props.image}
          style={{ margin: 10 }}
        />

        <View
          style={{
            padding: 10,
            paddingLeft: 0,
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            alignContent: "flex-start"
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              alignContent: "flex-start"
            }}
          >
            {!hasImage && (
              <View
                style={{
                  maxWidth: "100%",
                  marginBottom: 3,
                  backgroundColor,
                  padding: 10,
                  borderRadius: 20,
                  borderTopLeftRadius: 3,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <Text
                  multiline={true}
                  style={{
                    color,
                    fontSize: 16,
                    fontFamily: FONT,
                    fontWeight: "500"
                  }}
                >
                  {this.props.text}
                </Text>
              </View>
            )}

            {hasImage && (
              <Image
                style={{
                  height: 100,
                  width: width - 150,
                  borderRadius: 20,
                  marginBottom: 10
                }}
                source={{ uri: `${S3_PATH}${this.props.url}` }}
                resizeMode="cover"
              />
            )}

            {!this.props.hasNext && (
              <View
                style={{
                  paddingBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  {this.props.plan != 0 && (
                    <Icon
                      name="check-circle"
                      size={14}
                      color={COLORS.DARK.v3}
                      style={{ marginRight: 5 }}
                    />
                  )}

                  <Text
                    style={{
                      color: COLORS.DARK.v3,
                      fontSize: 10,
                      fontFamily: FONT,
                      fontWeight: "600"
                    }}
                  >
                    {this.props.name.split(" ")[0].toUpperCase()}
                  </Text>

                  {this.props.owner && (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: COLORS.DARK.v3,
                        fontSize: 10,
                        fontFamily: FONT,
                        fontWeight: "600"
                      }}
                    >
                      (YOU)
                    </Text>
                  )}
                </View>

                <Text
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    color: COLORS.DARK.v1,
                    fontSize: 10,
                    fontFamily: FONT,
                    fontWeight: "500"
                  }}
                >
                  {this.props.createdAt}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({ reaction: true });

                    Animated.timing(this.state.opacity, {
                      toValue: 1,
                      duration: 250
                    }).start();
                  }}
                >
                  <Ionicon name="md-happy" size={18} color="#888891" />
                </TouchableOpacity>

                <View style={{ flex: 1 }} />
              </View>
            )}

            {this.props.reactions && (
              <View
                style={{
                  paddingTop: 5,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                {this.props.reactions.map((reaction, index) => {
                  const reactionArray = reaction.split(":");
                  const emoticon = reactionArray[0];
                  const uname = reactionArray[1].split(" ")[0];
                  const uid = reactionArray[2];

                  // Only valid reactions
                  if (!uid) return null;

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (uid == this.props.uid)
                          this.props.removeMessageReaction(
                            this.props.id,
                            reaction
                          );
                      }}
                      style={{
                        backgroundColor: "#F7F7F7",
                        borderRadius: 20,
                        padding: 5,
                        paddingLeft: 10,
                        paddingRight: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        marginRight: 3,
                        marginBottom: 3
                      }}
                    >
                      <Text>{emoticon}</Text>
                      <Text
                        style={{
                          paddingLeft: 3,
                          color: "#C5C5D2",
                          fontSize: 12,
                          fontFamily: FONT,
                          fontWeight: "800"
                        }}
                      >
                        {uname.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
