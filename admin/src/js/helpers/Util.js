import EventEmitter from "eventemitter3";

export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
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

export const deg2rad = (deg) => {
    return (deg * Math.PI) / 180.0;
};

export const rad2deg = (rad) => {
    return (rad * 180.0) / Math.PI;
};

export const Base64Decode = (encoded) => {
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

export const getQuote = function () {
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
        "Whoever is happy will make others happy too.",
    ];

    return quotes[Math.floor(Math.random(quotes.length) * 10)];
};

Array.prototype.flatten = function () {
    return this.length == 0 ? null : this[0];
};

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export function setCookie(name, val) {
    const date = new Date();
    const value = val;

    // Set it expire in 7 days
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Set it
    document.cookie =
        name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}

export function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

export function deleteCookie(name) {
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

    // Set it
    document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
}

export function timeToDecimal(t) {
    var arr = t.split(":");
    var dec = parseInt((arr[1] / 6) * 10, 10);

    return parseFloat(parseInt(arr[0], 10) + "." + (dec < 10 ? "0" : "") + dec);
}

export function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");

    return JSON.parse(window.atob(base64));
}

export function currentAuthenticatedUser() {
    return new Promise((resolve, reject) => {
        const jwt = getCookie("jwt");

        if (jwt) {
            const { exp, sub } = parseJwt(jwt);

            if (exp > Date.now() / 1000) {
                resolve({
                    message: "Successfully logged in",
                    payload: sub,
                    token: jwt,
                });
            } else {
                reject("Expired");
            }
        } else {
            reject("No user");
        }
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
