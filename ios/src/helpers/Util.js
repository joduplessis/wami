import { AsyncStorage, Alert } from "react-native";
import { STORAGE_KEY_LOGGEDIN, API_PATH } from "./";
import RNFetchBlob from "rn-fetch-blob";
import EventEmitter from "eventemitter3";

export const updateDevice = (_id, token, device) => {
  fetch(`${API_PATH}/user/${_id}/device`, {
    method: "put",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ device })
  }).catch(error => {
    console.log("Device", error);
  });
};

export const updateOffline = (_id, token, state) => {
  fetch(`${API_PATH}/user/${_id}/offline`, {
    method: "put",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ offline: state == "active" ? false : true })
  }).catch(error => {
    console.log("Offline", error);
  });
};

export const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const theta = lon1 - lon2;
  const unit = "K";

  let dist =
    Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) +
    Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.cos(this.deg2rad(theta));

  dist = Math.acos(dist);
  dist = this.rad2deg(dist);
  dist = dist * 60 * 1.1515;

  if (unit == "K") {
    dist = dist * 1.609344;
  } else if (unit == "N") {
    dist = dist * 0.8684;
  }

  return Math.round(dist);
};

export const deg2rad = deg => {
  return (deg * Math.PI) / 180.0;
};

export const rad2deg = rad => {
  return (rad * 180.0) / Math.PI;
};

export const Base64Decode = encoded => {
  const keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  let output = "";
  let chr1, chr2, chr3;
  let enc1, enc2, enc3, enc4;
  let i = 0;

  do {
    enc1 = keyStr.indexOf(encoded.charAt(i++));
    enc2 = keyStr.indexOf(encoded.charAt(i++));
    enc3 = keyStr.indexOf(encoded.charAt(i++));
    enc4 = keyStr.indexOf(encoded.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }

    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < encoded.length);

  return output;
};

export const getQuote = function() {
  const quotes = [
    "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.",
    "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence.",
    "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.",
    "Always do your best. What you plant now, you will harvest later.",
    "In order to succeed, we must first believe that we can.",
    "You have to learn the rules of the game. And then you have to play better than anyone else.",
    "A creative man is motivated by the desire to achieve, not by the desire to beat others.",
    "Keep your eyes on the stars, and your feet on the ground.",
    "Believe in yourself! Have faith in your abilities! Without a humble but reasonable confidence in your own powers you cannot be successful or happy.",
    "Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.",
    "Ever tried. Ever failed. No matter. Try Again. Fail again. Fail better.",
    "Pursue one great decisive aim with force and determination.",
    "We may encounter many defeats but we must not be defeated.",
    "Do something wonderful, people may imitate it.",
    "Perfection is not attainable, but if we chase perfection we can catch excellence.",
    "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.",
    "It is during our darkest moments that we must focus to see the light.",
    "Believe you can and you're halfway there.",
    "My mission in life is not merely to survive, but to thrive; and to do so with some passion, some compassion, some humor, and some style.",
    "Whoever is happy will make others happy too."
  ];

  return quotes[Math.floor(Math.random(quotes.length) * 10)];
};

Array.prototype.flatten = function() {
  return this.length == 0 ? null : this[0];
};

String.prototype.toTitleCase = function() {
  return this.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export function parseJwt(token) {
  var base64 = require("base-64");
  var base64Url = token.split(".")[1];

  return JSON.parse(base64.decode(base64Url));
}

export function currentAuthenticatedUser() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(STORAGE_KEY_LOGGEDIN)
      .then(jwt => {
        if (jwt) {
          console.log("JWT: ", jwt);

          const { exp, sub } = parseJwt(jwt);

          if (exp > Date.now() / 1000) {
            // Set this globally!!!
            global._id = sub;

            resolve({
              message: "Successfully logged in",
              payload: sub,
              token: jwt,
              id: sub
            });
          } else {
            reject("Expired");
          }
        } else {
          reject("No user");
        }
      })
      .catch(err => {
        reject(null);
      });
  });
}

export function uploadFile(filename, path, key) {
  const ext = filename.split(".")[filename.split(".").length - 1];
  const mimeExt = ext.toLowerCase() == "jpg" ? "jpeg" : ext.toLowerCase();
  const mime = `image/${mimeExt}`;

  return fetch(`${API_PATH}/upload`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      filename,
      mime,
      key
    })
  })
    .then(response => response.json())
    .then(response => {
      const { url } = response;

      return RNFetchBlob.fetch(
        "PUT",
        url,
        { "Content-Type": mime },
        RNFetchBlob.wrap(path)
      );
    })
    .catch(error => {
      throw new Error(error);
    });
}

export class EventFactory {
  ee = null;

  static get() {
    if (this.ee == null) {
      this.ee = new EventEmitter();
    }

    return this.ee;
  }
}
