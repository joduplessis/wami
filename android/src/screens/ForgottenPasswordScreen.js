import React from "react";
import {
  Alert,
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
import { LoadingComponent } from "../components";
import { API_PATH, FONT } from "../helpers";

class ForgottenPasswordScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: false,
      verify: false,
      email: "",
      code: "",
      password: ""
    };

    this.hideError = this.hideError.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  resetPassword() {
    this.setState({
      loading: true,
      error: null
    });

    fetch(`${API_PATH}/password/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email: this.state.email
      })
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();

        return Promise.all([statusCode, data]);
      })
      .then(([statusCode, data]) => {
        switch (statusCode) {
          case 500:
            this.setState({
              error: "There has been an error",
              loading: null
            });
            break;

          case 404:
            this.setState({
              error: "User not found",
              loading: null
            });
            break;

          case 200:
            this.setState({
              verify: true,
              loading: false,
              error: null
            });
            break;
        }
      })
      .catch(error => {
        this.setState({
          error: "There has been an error",
          loading: null
        });
      });
  }

  updatePassword() {
    this.setState({
      loading: true,
      error: null
    });

    fetch(`${API_PATH}/password/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        forgotten_password: this.state.code,
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
          case 500:
            this.setState({
              error: "There has been an error",
              loading: null
            });
            break;

          case 404:
            this.setState({
              error: "User not found",
              loading: null
            });
            break;

          case 200:
            this.setState({
              verify: false,
              loading: false,
              error: null
            });

            this.props.navigation.navigate("Signin");
            break;
        }
      })
      .catch(error => {
        this.setState({
          error: "User not found",
          loading: null
        });
      });
  }

  hideError() {
    this.setState({ error: null });
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
              color: "#C8CBA3",
              fontSize: 40,
              fontWeight: "800",
              fontFamily: FONT,
              textAlign: "center"
            }}
          >
            Recover Password
          </Text>
        </View>

        {this.state.verify && (
          <Text
            style={{
              padding: 10,
              color: "#424E5E",
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center"
            }}
          >
            Enter the code we emailed you along with your new password.
          </Text>
        )}

        {!this.state.verify && (
          <Text
            style={{
              padding: 10,
              color: "#424E5E",
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center"
            }}
          >
            Enter your email in the text field below and we'll send you
            instructions on how to reset your password.
          </Text>
        )}

        {this.state.error && (
          <TouchableOpacity onPress={this.hideError}>
            <Text
              style={{
                color: "#424E5E",
                fontSize: 16,
                fontFamily: FONT,
                fontWeight: "500",
                textAlign: "center",
                paddingTop: 5
              }}
            >
              {this.state.error}
            </Text>
          </TouchableOpacity>
        )}

        <LoadingComponent visible={this.state.loading} />

        {this.state.verify && (
          <View
            style={{
              marginTop: 0,
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
        )}

        {this.state.verify && (
          <View
            style={{
              marginBottom: 5,
              padding: 10,
              borderRadius: 5,
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
              value={this.state.code}
              placeholder="Verification Code"
              onChangeText={code => this.setState({ code })}
            />
          </View>
        )}

        {!this.state.verify && (
          <View
            style={{
              marginBottom: 5,
              padding: 10,
              borderRadius: 5,
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
        )}

        {!this.state.verify && (
          <TouchableOpacity
            onPress={this.resetPassword}
            style={{
              padding: 10,
              borderRadius: 5,
              width: "85%",
              marginBottom: 5,
              backgroundColor: "#C8CBA3",
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
              Reset Password
            </Text>
          </TouchableOpacity>
        )}

        {!this.state.verify && (
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
                fontWeight: "900",
                fontFamily: FONT,
                textAlign: "center"
              }}
            >
              Go back
            </Text>
          </TouchableOpacity>
        )}

        {this.state.verify && (
          <TouchableOpacity
            onPress={this.updatePassword}
            style={{
              padding: 10,
              borderRadius: 5,
              width: "85%",
              marginBottom: 5,
              backgroundColor: "#C8CBA3",
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
              Update Password
            </Text>
          </TouchableOpacity>
        )}

        {this.state.verify && (
          <TouchableOpacity
            onPress={() => this.setState({ verify: false })}
            style={{
              padding: 10,
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
        )}
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const ForgottenPasswordScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgottenPasswordScreenRC);
