import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView
} from "react-native";
import { AvatarComponent, ButtonComponent } from "./";
import { COLORS } from "../helpers";

export class ContactComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={{
          borderTopWidth: 0,
          borderColor: "#eef2f5",
          marginBottom: 0,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          ...this.props.style
        }}
      >
        {this.props.avatar != false && (
          <AvatarComponent
            title={this.props.name}
            image={this.props.image}
            borderColor={this.props.color}
            size="small"
            padding={true}
            style={{ marginRight: 15 }}
          />
        )}

        <View
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
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <Text style={{ fontSize: 20, color: "#424E5E", fontWeight: "400" }}>
              {this.props.name}
            </Text>

            {this.props.label && (
              <View
                style={{
                  maxWidth: 70,
                  marginLeft: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{ fontSize: 11, color: "#C5C5D2", fontWeight: "800" }}
                >
                  {this.props.label.toUpperCase()}
                </Text>
              </View>
            )}

            <View style={{ flex: 1 }} />

            {this.props.button && (
              <ButtonComponent
                size="small"
                title={this.props.button}
                action={this.props.buttonAction}
                color="#ED4A70"
                backgroundColor="white"
                style={{ marginLeft: 5 }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
