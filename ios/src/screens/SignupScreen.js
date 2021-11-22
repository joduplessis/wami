import React from "react";
import {
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
import { LoadingComponent } from "../components";
import { API_PATH, FONT } from "../helpers";

class SignupScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      show: false,
      loading: false,
      error: null
    };

    this.hideError = this.hideError.bind(this);
    this.signUp = this.signUp.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  }

  hideError() {
    this.setState({ error: null });
  }

  signUp() {
    this.setState({
      loading: true,
      error: null
    });

    fetch(`${API_PATH}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();

        return Promise.all([statusCode, data]);
      })
      .then(([statusCode, data]) => {
        switch (statusCode) {
          case 200:
            this.setState({
              loading: null,
              error: null
            });

            Alert.alert("Please log in!");

            this.props.navigation.navigate("Signin");
            break;

          case 401:
            this.setState({
              error: "User exists",
              loading: false
            });
            break;

          case 500:
            this.setState({
              error: "That has been an error",
              loading: false
            });
            break;
        }
      })
      .catch(err => {
        this.setState({
          error: "That has been an error",
          loading: false
        });
      });
  }

  toggleShow() {
    this.setState({ show: !this.state.show });
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={{
          backgroundColor: "white",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center"
        }}
      >
        <Image
          style={{
            zIndex: 0,
            width,
            height,
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0.05
          }}
          source={require("../../assets/images/background-white-transparent.png")}
          resizeMode="cover"
        />

        <View
          style={{
            padding: 10,
            paddingBottom: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <Text
            style={{
              color: "#E26D5C",
              fontSize: 40,
              fontWeight: "800",
              textAlign: "center",
              fontFamily: FONT
            }}
          >
            Create an Account
          </Text>
        </View>

        <Text
          style={{
            padding: 10,
            color: "#424E5E",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: FONT,
            textAlign: "center"
          }}
        >
          Don't worry, we'll always keep your details private. You can use your
          email address as your username.
        </Text>

        {this.state.error && (
          <TouchableOpacity onPress={this.hideError}>
            <Text
              style={{
                color: "#424E5E",
                fontFamily: FONT,
                padding: 5,
                fontSize: 16,
                fontWeight: "800",
                textAlign: "center"
              }}
            >
              {this.state.error}
            </Text>
          </TouchableOpacity>
        )}

        <LoadingComponent visible={this.state.loading} />

        <View
          style={{
            margin: 2,
            borderRadius: 5,
            padding: 10,
            width: "85%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <TextInput
            placeholderTextColor="#AAA"
            style={{
              flex: 1,
              color: "#424E5E",
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: "500"
            }}
            value={this.state.email}
            placeholder="Email"
            onChangeText={email =>
              this.setState({ email: email.toLowerCase() })
            }
          />
        </View>

        <View
          style={{
            margin: 2,
            borderRadius: 5,
            padding: 10,
            marginBottom: 5,
            width: "85%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <TextInput
            placeholderTextColor="#AAA"
            style={{
              flex: 1,
              color: "#424E5E",
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: "500"
            }}
            value={this.state.password}
            placeholder="Password"
            secureTextEntry={!this.state.show}
            onChangeText={password => this.setState({ password })}
          />
          <TouchableOpacity onPress={this.toggleShow}>
            <Icon
              name="eye"
              size={20}
              color="#424E5E"
              style={{ opacity: this.state.show ? 1 : 0.5 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={this.signUp}
          style={{
            padding: 10,
            borderRadius: 5,
            width: "85%",
            marginBottom: 5,
            backgroundColor: "#E26D5C",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <Text
            style={{
              flex: 1,
              color: "white",
              fontSize: 16,
              fontWeight: "900",
              fontFamily: FONT,
              textAlign: "center"
            }}
          >
            Create my account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Signin")}
          style={{
            padding: 10,
            borderRadius: 5,
            width: "85%",
            marginBottom: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <Text
            style={{
              flex: 1,
              color: "#424E5E",
              fontSize: 13,
              fontWeight: "800",
              fontFamily: FONT,
              textAlign: "center"
            }}
          >
            Go back
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  account: payload => {
    dispatch(account(payload));
  }
});

export const SignupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupScreenRC);
