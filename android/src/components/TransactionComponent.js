import React from "react";
import { View, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { COLORS } from "../helpers";

export class TransactionComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = Dimensions.get("screen").width;
    const color = this.props.official ? "#25D5A1" : "#424E5E";

    return (
      <View
        style={{
          padding: 20,
          borderColor: "#EFEFEF",
          borderTopWidth: 2,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
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
              <Text
                style={{
                  fontSize: 10,
                  color: "#818F9E",
                  fontWeight: "800",
                  paddingRight: 10
                }}
              >
                {this.props.title.toUpperCase()}
              </Text>
              <View style={{ flex: 1 }} />
            </View>

            <View
              style={{
                paddingBottom: 5,
                paddingTop: 5,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                alignContent: "center"
              }}
            >
              <Text style={{ fontSize: 18, color, fontWeight: "600" }}>
                {this.props.description}
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
              <Icon name="clock" size={15} color="#818F9E" />
              <Text
                style={{
                  fontSize: 15,
                  color: "#818F9E",
                  fontWeight: "500",
                  paddingLeft: 5,
                  paddingRight: 10
                }}
              >
                {new Date(this.props.created).toLocaleDateString()}
              </Text>
              <Icon name="credit-card" size={15} color="#818F9E" />
              <Text
                style={{
                  fontSize: 15,
                  color: "#818F9E",
                  fontWeight: "500",
                  paddingLeft: 5
                }}
              >
                ZAR{this.props.amount}
              </Text>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
