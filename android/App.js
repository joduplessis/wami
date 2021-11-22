require("./shim.js");
require("./moment.js");

import React, { Component } from "react";
import {
  View,
  Alert,
  YellowBox,
  AppState,
  Dimensions,
  TouchableOpacity,
  Text,
  NetInfo
} from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import {
  ActionSheetProvider,
  connectActionSheet
} from "@expo/react-native-action-sheet";
import rootReducer from "./src/reducers";
import thunk from "redux-thunk";
import { Router } from "./Router";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { appState, connected, initialize } from "./src/actions";
import { API_PATH, WEBRTC_CONFIG, MQTT, EventFactory } from "./src/helpers";
import { IncomingCallPartial, CallPartial } from "./src/partials";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStreamTrack,
  getUserMedia
} from "react-native-webrtc";
import { createLogger } from "redux-logger";
//import { Sentry } from "react-native-sentry";
import OneSignal from "react-native-onesignal";

// Sentry
// Sentry.config('https://70d7b89277184ab69a5190673f352b45@sentry.io/1273085').install();

// Supress the yello

YellowBox.ignoreWarnings([
  "Require cycles are allowed",
  "Warning: Can't call setState",
  "Warning: Slider has been extracted from",
  "Warning: NetInfo",
  "Warning: Async",
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
  "requires main queue setup since it overrides `constantsToExport` but doesn't implement `requiresMainQueueSetup`",
  "Module A0Auth0",
  "RCTBridge",
  "Class RCTCxxModule was not exported",
  "RCTAppState",
  "Required dispatch_sync",
  "RCTAppState",
  "Native TextInput",
  "DEPRECATED:",
  "Module RNOS requires",
  "Remote debugger is in a background tab",
  "Task orphaned for request",
  "Module RNFetchBlob",
  "Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.",
  "Module RNInCallManager requires main queue setup"
]);

// Setup GraphQL
const apollo = new ApolloClient({
  link: new HttpLink({ uri: `${API_PATH}/graphql` }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore"
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all"
    }
  }
});

// Redux Logger
const logger = createLogger({
  collapsed: false,
  diff: true
});

// Our intial store creation
const store = createStore(
  rootReducer,
  applyMiddleware(thunk) //, logger),
);

// AWS stuff
// Amplify.Logger.LOG_LEVEL = 'DEBUG'
// AWS.config.region = aws_exports.Auth.region;
// Amplify.configure(aws_exports);
// Top levels
let localStream = null;
let container = null;
let peerConnection = null;

const getLocalStream = (isFront, callback) => {
  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  // if (Platform.OS === 'ios') {
  MediaStreamTrack.getSources(sourceInfos => {
    console.log("sourceInfos: ", sourceInfos);

    let videoSourceId;

    for (const i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];

      if (
        sourceInfo.kind == "video" &&
        sourceInfo.facing == (isFront ? "front" : "back")
      ) {
        videoSourceId = sourceInfo.id;
      }
    }

    getUserMedia(
      {
        audio: true,
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 360,
            minFrameRate: 30
          },
          facingMode: isFront ? "user" : "environment",
          optional: videoSourceId ? [{ sourceId: videoSourceId }] : []
        }
      },
      stream => {
        console.log("getUserMedia success ::");
        console.log(stream);

        callback(stream);
      },
      error => {
        console.log("getUserMedia error ::");
        console.log(error);
      }
    );
  });
};

const createPeerConnection = (sender, receiver, isOffer) => {
  const pc = new RTCPeerConnection(WEBRTC_CONFIG);

  const createOffer = () => {
    pc.createOffer(
      desc => {
        pc.setLocalDescription(
          desc,
          () => {
            // Get the local description from the connection
            const { localDescription } = pc;

            // Send our offer to the other user
            // We set ourselves to receiver
            // So the other user can user this and send US the message
            // using the 'receiver' payload object
            MQTT.dispatch(
              receiver,
              {
                type: "WEBRTC_OFFER",
                payload: {
                  localDescription,
                  sender
                }
              },
              sender
            );
          },
          error => console.error(error)
        );
      },
      error => console.error(error)
    );
  };

  pc.onicecandidate = event => {
    // If the event's candidate property is null, ICE gathering has finished.
    if (event.candidate) {
      // Send this to the receiver ID
      MQTT.dispatch(
        receiver,
        {
          type: "WEBRTC_CANDIDATE",
          payload: event.candidate
        },
        sender
      );
    }
  };

  pc.onnegotiationneeded = () => {
    if (isOffer) {
      createOffer();
    }
  };

  pc.onaddstream = event => {
    console.log("onaddstream", event.stream);

    // Stream added from other user
    container.setState({
      remoteViewSrc: event.stream.toURL()
    });
  };

  pc.oniceconnectionstatechange = event => {
    console.log(
      "oniceconnectionstatechange:: ",
      event.target.iceConnectionState
    );

    // If everything is complete
    // We're not doing anything here yet
    // if (event.target.iceConnectionState === 'completed') {}
    // All ice candidates have been exchanged
    // We also don't do anytihng here
    // if (event.target.iceConnectionState === 'connected') {}
    if (event.target.iceConnectionState === "closed") {
      // Reset media streams
      container.setState({
        selfViewSrc: null,
        remoteViewSrc: null,
        incomingCall: null,
        incoming_call_partial: null,
        call_partial: null,
        rate: null
      });
    }
  };

  pc.onsignalingstatechange = event => {
    console.log("onsignalingstatechange", event.target.signalingState);
  };

  pc.onremovestream = event => {
    console.log("onremovestream", event.stream);
  };

  return pc;
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      incoming_call_partial: null,
      call_partial: null,
      incomingCall: null,
      selfViewSrc: null,
      remoteViewSrc: null,
      isFront: false,
      rate: null,
      incomingNotice: false
    };

    this.switchVideoType = this.switchVideoType.bind(this);
    this.callAccept = this.callAccept.bind(this);
    this.callDecline = this.callDecline.bind(this);
    this.callEnd = this.callEnd.bind(this);
  }

  componentDidMount() {
    container = this;

    // Internet connection info
    NetInfo.addEventListener("connectionChange", connectionInfo => {
      if (connectionInfo.type == "none" || connectionInfo.type == "unknown")
        store.dispatch(connected(false));
      if (connectionInfo.type == "wifi" || connectionInfo.type == "cellular")
        store.dispatch(initialize());

      NetInfo.removeEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
      );
    });

    /*
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type == "none" || connectionInfo.type == "unknown") store.dispatch(connected(false));
            if (connectionInfo.type == "wifi" || connectionInfo.type == "cellular")store.dispatch(initialize());
        });
        */

    // Add a listener for our app background/foreground
    AppState.addEventListener("change", nextAppState => {
      store.dispatch(appState(nextAppState));
    });

    // Initialize the event receptors
    this.initEvents();

    // Do this right off the bat, so we get the permissions
    /**
        PushNotificationIOS.requestPermissions() .then((rpermissions) => {
            console.log("Getting permissions: ", rpermissions);

            PushNotificationIOS.checkPermissions((cpermissions) => {
                console.log("Checking permissions: ", cpermissions);
            });
        });
        */
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  initEvents() {
    EventFactory.get().on("start", payload => {
      // The receiver object here is an object of the user we're calling
      // So we create our object to send them
      const { sender, receiver } = payload;

      // Update our state so we know what's going on
      // incomingCall is the other person's details
      // We will send them ours (sender)
      this.setState({
        incomingCall: receiver,
        rate: null,
        incomingNotice: true
      });

      // Create the peer connection FROM us
      // The _id object here are for communicating to them
      peerConnection = createPeerConnection(sender._id, receiver._id, true);

      // Now start the flow of request, answering, etc.
      // we send them our details, this will intiate their screen so they can
      // accept or decline
      MQTT.dispatch(
        receiver._id,
        {
          type: "WEBRTC_REQUEST",
          payload: sender
        },
        sender._id
      );
    });

    EventFactory.get().on("request", payload => {
      // Payload the other user: 'sender',
      // so we need to set them as the receiver here
      this.setState({
        rate: payload._id,
        selfViewSrc: null,
        remoteViewSrc: null,
        incomingCall: payload,
        call_partial: false,
        incoming_call_partial: true
      });
    });

    EventFactory.get().on("accept", payload => {
      // Once the other user has accepted our call,
      // We can add our stream to the peerConnection
      // We also update our self view
      getLocalStream(true, stream => {
        console.log("stream", stream);

        // Add our local stream
        peerConnection.addStream(stream);

        // Set our self source to stream
        // This will also set the name, image & _id of the user
        this.setState({
          selfViewSrc: stream.toURL(),
          call_partial: true,
          incoming_call_partial: false,
          incomingNotice: null
        });
      });
    });

    EventFactory.get().on("end", payload => {
      // Declined by the othe user
      peerConnection.close();

      // Reset media streams
      this.setState({
        selfViewSrc: null,
        remoteViewSrc: null,
        incomingCall: null,
        call_partial: null,
        incoming_call_partial: null,
        incomingNotice: null
      });
    });

    EventFactory.get().on("decline", payload => {
      // Declined by the othe user
      peerConnection.close();

      // Tell the user
      Alert.alert("Sorry", "The other user has declined your call");

      // Reset media streams
      this.setState({
        selfViewSrc: null,
        remoteViewSrc: null,
        incomingCall: null,
        call_partial: null,
        incoming_call_partial: null,
        incomingNotice: null
      });
    });

    // These actions are handled by the WebRTC flow
    // The peerConnection will send offers, answers & ice candidates

    EventFactory.get().on("offer", payload => {
      console.log("offer:::", payload);

      // 'sender' we got from the other user: it's their ID
      const { localDescription } = payload;

      // We want to send this BACK TO THEM
      // so the sender becomes the receiver now
      // and we become the sender
      const receiver = payload.sender;
      const sender = store.getState().account._id;

      // Create the peer connection if it's not there
      if (!peerConnection)
        peerConnection = createPeerConnection(sender, receiver, false);

      // Initiate the pperConnection object and also send the answer
      // back to the other user
      peerConnection.setRemoteDescription(
        new RTCSessionDescription(localDescription),
        () => {
          peerConnection.createAnswer(
            desc => {
              peerConnection.setLocalDescription(
                desc,
                () => {
                  console.log(
                    "offer-answer:::",
                    peerConnection.localDescription
                  );

                  // Now create the answer to their offer
                  // We send them our localDescription
                  MQTT.dispatch(
                    receiver,
                    {
                      type: "WEBRTC_ANSWER",
                      payload: peerConnection.localDescription
                    },
                    sender
                  );
                },
                error => console.error("setLocalDescription", error)
              );
            },
            error => console.error("peerConnection.createAnswer", error)
          );
        },
        error => console.error("peerConnection.setRemoteDescription", error)
      );
    });

    EventFactory.get().on("answer", payload => {
      console.log("answer:::", payload);

      // We got their answer!
      // The payload is actually the peerConnection.localDescription sent from the other user
      // Our peerConnection object is already set up (or should be)
      // So now just add their local description
      peerConnection.setRemoteDescription(
        new RTCSessionDescription(payload),
        () => {
          console.log("Successfully set");
        },
        error => {
          console.error("peerConnection.setRemoteDescription", error);
        }
      );
    });

    EventFactory.get().on("candidate", payload => {
      console.log("candidate:::", payload);

      // payload here is the event.candidate
      const candidate = new RTCIceCandidate(payload);

      // Add it to our connection, from the other person
      peerConnection.addIceCandidate(candidate);
    });
  }

  switchVideoType() {
    const isFront = !this.state.isFront;

    // Swap them
    this.setState({
      isFront
    });

    getLocalStream(isFront, stream => {
      if (localStream) {
        // If we can get a local stream, we remove this one
        peerConnection.removeStream(localStream);

        // End the current media stream
        localStream.release();
      }

      // Update our local stream with the new one
      localStream = stream;

      // Update the actual view
      container.setState({
        selfViewSrc: stream.toURL()
      });

      // Let the other person know
      peerConnection.addStream(localStream);
    });
  }

  callEnd() {
    if (peerConnection) peerConnection.close();

    // Receiver is the person calling us, the OTHER person
    // So we need to set them as the receiver with our peer connection
    const sender = store.getState().account._id;
    const receiver = this.state.incomingCall._id;

    // Tell them NO
    MQTT.dispatch(
      receiver,
      {
        type: "WEBRTC_END",
        payload: null
      },
      sender
    );

    // Reset everything
    this.setState({
      selfViewSrc: null,
      remoteViewSrc: null,
      incomingCall: null,
      call_partial: false,
      incoming_call_partial: false,
      rate: null
    });
  }

  callAccept() {
    this.setState({
      call_partial: true,
      incoming_call_partial: false
    });

    // Receiver is the person calling us, the OTHER person
    // So we need to set them as the receiver with our peer connection
    const sender = store.getState().account._id;
    const receiver = this.state.incomingCall._id;

    // Create the peer connection if it's not there
    if (!peerConnection)
      peerConnection = createPeerConnection(sender, receiver, false);

    // Now we can also attach our media to the screen
    // and send them that
    getLocalStream(true, stream => {
      // After we get the local stream
      // We update our own self view to show ourselves
      this.setState({
        selfViewSrc: stream.toURL()
      });

      // Add our local stream
      peerConnection.addStream(stream);

      // Tell them YES
      // They can then attach their media
      MQTT.dispatch(
        receiver,
        {
          type: "WEBRTC_ACCEPT",
          payload: null
        },
        sender
      );
    });
  }

  callDecline() {
    this.setState({
      call_partial: false,
      incoming_call_partial: false
    });

    // Receiver is the person calling us, the OTHER person
    // So we need to set them as the receiver with our peer connection
    const sender = store.getState().account._id;
    const receiver = this.state.incomingCall._id;

    // Tell them NO
    MQTT.dispatch(
      receiver,
      {
        type: "WEBRTC_DECLINE",
        payload: null
      },
      sender
    );

    // Reset media streams
    this.setState({
      selfViewSrc: null,
      remoteViewSrc: null,
      incomingCall: null,
      rate: null
    });
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <View style={{ flex: 1 }}>
        <Provider store={store}>
          <ActionSheetProvider>
            <ApolloProvider client={apollo}>
              {this.state.incomingNotice && (
                <TouchableOpacity
                  onPress={() => this.setState({ incomingNotice: null })}
                  style={{
                    zIndex: 1000,
                    position: "absolute",
                    top: 0,
                    padding: 20,
                    paddingTop: 30,
                    width,
                    backgroundColor: "#0facf3",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                  >
                    Calling
                  </Text>
                </TouchableOpacity>
              )}

              <IncomingCallPartial
                incoming_call_partial={this.state.incoming_call_partial}
                incomingCall={this.state.incomingCall}
                callAccept={this.callAccept}
                callDecline={this.callDecline}
              />

              <CallPartial
                call_partial={this.state.call_partial}
                callEnd={this.callEnd}
                isFront={this.state.isFront}
                incomingCall={this.state.incomingCall}
                switchVideoType={this.switchVideoType}
                selfViewSrc={this.state.selfViewSrc}
                remoteViewSrc={this.state.remoteViewSrc}
              />

              <Router />
            </ApolloProvider>
          </ActionSheetProvider>
        </Provider>
      </View>
    );
  }
}
