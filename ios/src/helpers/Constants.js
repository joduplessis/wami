import { Platform } from "react-native";

export const API_PATH = __DEV__ ? "http://localhost:8181" : "https://wami-api.herokuapp.com";
export const MQTT_PATH = "wss://mqtt.eclipse.org/mqtt";
export const S3_PATH = "https://wami-app.s3-us-west-2.amazonaws.com/";
export const VERSION = "1.3.12";
export const BUILD = "21";
export const WEBRTC_CONFIG = {
  iceServers: [{ urls: "stun:stunserver.org" }]
};
export const WEBRTC_CONSTRAINTS = { audio: true, video: true };
export const WEBRTC_TOPIC = "wami_webrtc";
export const CONTACT = "CONTACT";
export const CHANNEL = "CHANNEL";
export const GROUP = "GROUP";
export const EVENT = "EVENT";
export const USER = "USER";
export const DECLINED = "DECLINED";
export const CONFIRMED = "CONFIRMED";
export const INVITED = "INVITED";
export const CONTACT_REQUEST_UNCONFIRMED = "CONTACT_REQUEST_UNCONFIRMED";
export const CONTACT_REQUEST_CONFIRMED = "CONTACT_REQUEST_CONFIRMED";
export const CONTACT_REQUEST_PENDING = "CONTACT_REQUESTED_PENDING";
export const CONTACT_NOT_REQUESTED = "CONTACT_NOT_REQUESTED";
export const STORAGE_KEY_LOGGEDIN = "STORAGE_KEY_LOGGEDIN";
export const FONT = Platform.OS === "ios" ? "Avenir" : "Roboto";
export const COLORS = {
  DARK: {
    v0: "#ADA9A3",
    v1: "#B9B3AB",
    v2: "#928C84",
    v3: "#534E47",
    v4: "#3D3933",
    v5: "#282420",
    v6: "#161311"
  },
  LIGHT: {
    v0: "#FFFDFD",
    v1: "#F9F8F7",
    v2: "#F4F2F0",
    v3: "#EDEBE9",
    v4: "#E4E1DD",
    v5: "#D7D3CE"
  },
  ACCENT: {
    v0: "#3B0441",
    v1: "#904347",
    v2: "#EC8461",
    v3: "#F6D69D",
    v4: "#28376A",
    v5: "#465993",
    v6: "#EF6C31",
    v7: "#fcc34b",
    v8: "#6DB9BD",
    v9: "#1F2D3D"
  }
};
