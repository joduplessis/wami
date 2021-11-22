export const API_PATH =
    window.location.hostname == "127.0.0.1" ||
    window.location.hostname == "localhost"
        ? "http://localhost:8181"
        : "https://wami-api.herokuapp.com";
export const MQTT_PATH = "wss://mqtt.eclipse.org/mqtt";
export const S3_PATH = "https://wami-app.s3-us-west-2.amazonaws.com/";
export const CONTACT = "CONTACT";
export const CHANNEL = "CHANNEL";
export const GROUP = "GROUP";
export const EVENT = "EVENT";
export const USER = "USER";
export const WEEK = "WEEK";
export const DAY = "DAY";
export const MONTH = "MONTH";
export const DECLINED = "DECLINED";
export const CONFIRMED = "CONFIRMED";
export const INVITED = "INVITED";
export const CONTACT_REQUEST_UNCONFIRMED = "CONTACT_REQUEST_UNCONFIRMED";
export const CONTACT_REQUEST_CONFIRMED = "CONTACT_REQUEST_CONFIRMED";
export const CONTACT_REQUEST_PENDING = "CONTACT_REQUESTED_PENDING";
export const CONTACT_NOT_REQUESTED = "CONTACT_NOT_REQUESTED";
export const STORAGE_KEY_LOGGEDIN = "STORAGE_KEY_LOGGEDIN";
export const DEFAULT_VIEW = WEEK;
export const DEFAULT_DATE = "2019-10-31";
export const DEFAULT_HEIGHT = 20;
export const DEFAULT_SETTINGS_OPEN = false;
