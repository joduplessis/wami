import React from "react";
import {
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  AsyncStorage,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
import { LoadingComponent } from "../components";
import {
  updateDevice,
  updateOffline,
  API_PATH,
  S3_PATH,
  FONT,
  util,
  STORAGE_KEY_LOGGEDIN,
  currentAuthenticatedUser,
  GQL,
  COLORS,
  BUILD,
  VERSION
} from "../helpers";
import { account, token, initialize, hydrations } from "../actions";
import OneSignal from "react-native-onesignal";
import BackgroundFetch from "react-native-background-fetch";

class SigninScreenRC extends React.Component {
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
    this.forgotPassword = this.forgotPassword.bind(this);
    this.signIn = this.signIn.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  }

  componentDidMount() {
    this.initSignin();
    // AsyncStorage.removeItem(STORAGE_KEY_LOGGEDIN);
  }

  initSignin() {
    this.setState({
      loading: true,
      error: null
    });

    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresBatteryNotLow: false,
        requiresStorageNotLow: false
      },
      () => {
        updateOffline(
          this.props.account._id,
          this.props.account.token,
          "background"
        );

        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      },
      error => {
        console.log("[js] RNBackgroundFetch failed to start");
      }
    );

    // Optional: Query the authorization status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });

    currentAuthenticatedUser()
      .then(({ token, id }) => {
        this.props.token(token);

        // Fetch this user's account
        GQL.fetchUserAccount(id, token)
          .then(result => result.json())
          .then(result => {
            this.setState({
              loading: null,
              error: null
            });

            const { user } = result.data;
            const {
              _id,
              email,
              name,
              image,
              country,
              dob,
              color,
              timezone,
              plan
            } = user;

            this.props.account({
              _id,
              email,
              name,
              image,
              country,
              dob,
              color,
              timezone,
              token,
              plan
            });

            this.props.navigation.navigate("Main");
            this.props.initialize();

            // Register them as online
            // We don't get about the reply, but we eventually should
            updateOffline(_id, token, "active");
          })
          .catch(error => {
            this.setState({
              error: "There has been an error",
              loading: null
            });
          });
      })
      .catch(err => {
        this.setState({
          loading: null,
          error: null
        });
      });
  }

  signIn() {
    this.setState({
      loading: true,
      error: null
    });

    fetch(`${API_PATH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
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
            const { token, _id } = data;

            // Update our user details
            this.props.token(token);

            // Register them as online
            // We don't get about the reply, but we eventually should
            updateOffline(_id, token, "active");

            // Set our JWT in storage
            AsyncStorage.setItem(STORAGE_KEY_LOGGEDIN, token)
              .then(res => {
                // Fetch the base user
                GQL.fetchUserAccount(_id, token)
                  .then(result => result.json())
                  .then(result => {
                    const { user } = result.data;
                    const {
                      _id,
                      email,
                      name,
                      image,
                      country,
                      dob,
                      color,
                      timezone,
                      plan
                    } = user;

                    this.props.account({
                      _id,
                      email,
                      name,
                      token,
                      image,
                      country,
                      dob,
                      color,
                      timezone,
                      plan
                    });

                    // Remove the loading
                    this.setState({
                      loading: null,
                      email: "",
                      password: ""
                    });

                    this.props.navigation.navigate("Main");
                    this.props.initialize();
                  })
                  .catch(error => {
                    this.setState({
                      error: "User not found",
                      loading: null
                    });
                  });
              })
              .catch(err => {
                this.setState({
                  error: "Error setting token",
                  loading: null
                });
              });
            break;

          case 404:
            this.setState({
              error: "User not found",
              loading: false
            });
            break;

          case 401:
            this.setState({
              error: "Wrong password",
              loading: false
            });
            break;

          case 500:
            this.setState({
              error: "That has been an error",
              loading: false
            });
            break;

          default:
            this.setState({
              error: "That has been an error",
              loading: false
            });
            break;
        }
      })
      .catch(error => {
        console.log('Log in error: ', error)

        this.setState({
          error: "User not found",
          loading: null
        });
      });
  }

  toggleShow() {
    this.setState({ show: !this.state.show });
  }

  hideError() {
    this.setState({ error: null });
  }

  forgotPassword() {
    this.setState({
      error: null,
      loading: null
    });
    this.props.navigation.navigate("ForgottenPassword");
  }

  signUp() {
    this.setState({
      error: null,
      loading: null
    });
    this.props.navigation.navigate("Signup");
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={{
          backgroundColor: "#472D30",
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
            tintColor: "white",
            opacity: 0.05
          }}
          source={require("../../assets/images/background-white-transparent.png")}
          resizeMode="cover"
        />

        <Image
          style={{ width: 200, height: 50, marginBottom: 40 }}
          source={require("../../assets/images/logo-white.png")}
          resizeMode="contain"
        />

        {this.state.error && (
          <TouchableOpacity onPress={this.hideError}>
            <Text
              style={{
                color: "white",
                padding: 5,
                fontSize: 16,
                fontFamily: FONT,
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
            backgroundColor: "#472D30",
            borderBottomWidth: 2,
            borderColor: "#723D45",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <TextInput
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={{
              flex: 1,
              color: "white",
              fontSize: 16,
              fontFamily: FONT,
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
            backgroundColor: "#472D30",
            borderBottomWidth: 2,
            borderColor: "#723D45",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <TextInput
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={{
              flex: 1,
              color: "white",
              fontSize: 16,
              fontFamily: FONT,
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
              color="white"
              style={{ opacity: this.state.show ? 1 : 0.5 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ width: "85%", marginTop: 20 }}>
          <TouchableOpacity
            onPress={this.signIn}
            style={{
              padding: 10,
              borderRadius: 15,
              marginBottom: 5,
              backgroundColor: "#723D45",
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
                fontFamily: FONT,
                fontWeight: "900",
                textAlign: "center"
              }}
            >
              Sign in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.signUp}
            style={{
              padding: 10,
              borderRadius: 15,
              marginBottom: 5,
              backgroundColor: "#723D45",
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
                fontFamily: FONT,
                fontWeight: "900",
                textAlign: "center"
              }}
            >
              Create an account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.forgotPassword}
            style={{
              padding: 10,
              paddingBottom: 10,
              borderRadius: 5,
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
                color: "white",
                fontSize: 13,
                fontFamily: FONT,
                fontWeight: "900",
                textAlign: "center"
              }}
            >
              I've lost my password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("terms")}
            style={{
              borderRadius: 5,
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
                fontSize: 13,
                fontFamily: FONT,
                fontWeight: "500",
                textAlign: "center"
              }}
            >
              Help & support
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: "500",
              fontFamily: FONT,
              textAlign: "center",
              paddingTop: 10
            }}
          >
            v{VERSION} build {BUILD}
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  initialize: () => {
    dispatch(initialize());
  },

  account: payload => {
    dispatch(account(payload));
  },

  token: payload => {
    dispatch(token(payload));
  }
});

export const SigninScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninScreenRC);
